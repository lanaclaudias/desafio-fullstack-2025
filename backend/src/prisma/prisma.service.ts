/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

// diagnóstico e resolução da URL do SQLite
const rawUrl = process.env.DATABASE_URL || '';
let resolvedUrl = rawUrl;

try {
  if (rawUrl.startsWith('file:')) {
    const rel = rawUrl.replace(/^file:/, '').replace(/^\.?[\\/]/, '');
    const absPath = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
    resolvedUrl = `file:${absPath}`;
    console.debug('[PrismaService] process.cwd():', process.cwd());
    console.debug('[PrismaService] raw DATABASE_URL:', rawUrl);
    console.debug('[PrismaService] resolved DATABASE_URL:', resolvedUrl);

    // verifica existência e permissões do arquivo (lança erro se não acessível)
    if (!fs.existsSync(absPath)) {
      console.error(`[PrismaService] arquivo SQLite não encontrado em: ${absPath}`);
    } else {
      try {
        fs.accessSync(absPath, fs.constants.R_OK | fs.constants.W_OK);
        console.debug(`[PrismaService] acesso OK ao arquivo: ${absPath}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(`[PrismaService] sem permissão de leitura/escrita para: ${absPath}`, err.message);
      }
    }
  } else {
    console.debug('[PrismaService] DATABASE_URL não é do tipo file:, value=', rawUrl);
  }
} catch (err: any) {
  console.error('[PrismaService] erro ao resolver DATABASE_URL:', err.message);
}

// injeta a URL resolvida no client para evitar problemas de cwd relativo
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: resolvedUrl || undefined,
        },
      },
      // opcional: log level
      log: [{ emit: 'event', level: 'query' }],
    } as any);
  }

  async onModuleInit() {
    await this.$connect();
    console.debug('[PrismaService] $connect ok');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.debug('[PrismaService] $disconnect ok');
  }
}