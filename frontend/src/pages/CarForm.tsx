import React, { useEffect, useState, useRef } from 'react'
import api from '../api'

interface CarFormProps {
  id?: string | null
  onClose: () => void
  onSaved: () => void
}

export default function CarForm({ id, onClose, onSaved }: CarFormProps) {
  const [form, setForm] = useState<any>({
    model: '',
    version: '',
    year: '',
    mileage: '',
    price: '',
    description: '',
    brandId: '',
    storeId: '',
    images: [] as (File | string)[]
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const onFilesAdded = (items: Array<File | string>) => {
    setForm((s:any) => ({ ...s, images: [...(s.images || []), ...items] }))
  }

  const removeImageAt = (index: number) => {
    setForm((s:any) => ({ ...s, images: (s.images || []).filter((_:any, i:number) => i !== index) }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    if (files.length) onFilesAdded(files)
  }

  const handlePickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length) onFilesAdded(files)
  }
  const [brands, setBrands] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)

  useEffect(() => {
    api.get('/brands').then(r => setBrands(r.data.data || []))
    api.get('/stores').then(r => setStores(r.data.data || []))
    if (id) {
      api.get(`/cars/${id}`).then(r => setForm(r.data.data || form))
    }
  }, [id])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setMessage(null)
      const formData = new FormData()

      Object.entries(form).forEach(([k, v]) => {
        if (k === 'images') return 
        formData.append(k, v as string)
      })


      const files: File[] = []
      const existing: string[] = []
      const imgs = (form.images || []) as (File | string)[]
      imgs.forEach((it:any) => {
        if (typeof it === 'string') existing.push(it)
        else files.push(it as File)
      })


      files.forEach(f => formData.append('images', f))
     
      if (existing.length) formData.append('imagesExisting', JSON.stringify(existing))

      if (id) await api.put(`/cars/${id}`, formData)
      else await api.post('/cars', formData)

      const successText = id ? 'Edição realizada com sucesso' : 'Cadastro concluído com sucesso'
      setMessage({ type: 'success', text: successText })
      setShowResultModal(true)
      onSaved()

      setTimeout(() => { setShowResultModal(false); onClose() }, 900)
    } catch (e) {
      setMessage({ type: 'error', text: 'Falha ao salvar' })
      setLoading(false)
    }
  }

  const remove = async () => {
    if (!id) return
    if (!confirm('Confirma exclusão?')) return
    try {
      setLoading(true)
      await api.delete(`/cars/${id}`)
      setMessage({ type: 'success', text: 'Exclusão realizada com sucesso' })
      setShowResultModal(true)
      onSaved()
      setTimeout(() => { setShowResultModal(false); onClose() }, 900)
    } catch {
      setMessage({ type: 'error', text: 'Falha ao excluir' })
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          width: 500px;
          max-height: 70vh;
          overflow-y: auto;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 16px;
        }
        .field label {
        color: #010101ff;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .field input,
        .field select,
        .field textarea {
          border: 1px solid #010101ff;
          border-radius: 6px;
          padding: 10px;
          font-size: 14px;
        }
        .field textarea {
          resize: vertical;
          min-height: 80px;
        }
        .footer-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
        }
        .btn {
          border: none;
          padding: 10px 38px;
          border-radius: 25px;
          font-size: 14px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn.cancel {
          background: #f5f5f5;
          color: #333;
        }
        .btn.save {
          background: #007f56;
          color: #fff;
          padding: 8px 45px;
        }
        .btn.danger {
          background: #e74c3c;
          color: #fff;
        }
        .result-modal-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .result-modal {
          pointer-events: all;
          background: #fff;
          padding: 18px 22px;
          border-radius: 10px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.16);
          text-align: center;
          min-width: 260px;
        }

        /* upload area */
        .upload-area {
          border: 2px dashed #cfcfcf;
          border-radius: 12px;
          padding: 14px;
          min-height: 110px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          background: #fff;
        }
        .upload-area .thumbs {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .upload-area .thumb {
          width: 100px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: #f6f6f6;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }
        .upload-area .thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .upload-area .thumb.add {
          cursor: pointer;
          border: 1px solid #e6e6e6;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .upload-area .thumb .plus { font-size: 28px; color: #7d7d7d; }
        .upload-area .thumb .remove {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #ffffffcc;
          border: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.12);
          cursor: pointer;
        }
      `}</style>

      <div className="card">
        {message && !showResultModal && (
          <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: message.type === 'success' ? '#e6ffef' : '#ffecec', color: message.type === 'success' ? '#007f56' : '#a40000' }}>
            {message.text}
          </div>
        )}

        {showResultModal && message && (
          <div className="result-modal-overlay">
            <div className="result-modal">
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{message.text}</div>
              <div style={{ fontSize: 13, color: '#444' }}>{message.type === 'success' ? 'Operação concluída com sucesso.' : 'Ocorreu um problema.'}</div>
            </div>
          </div>
        )}
        <form onSubmit={submit}>
          <div className="field">
            <label>Marca</label>
            <select
              value={form.brandId}
              onChange={e => setForm({ ...form, brandId: e.target.value })}
            >
              <option value="">Selecione a marca</option>
              {brands.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Loja</label>
            <select
              value={form.storeId}
              onChange={e => setForm({ ...form, storeId: e.target.value })}
            >
              <option value="">Selecione a loja</option>
              {stores
                .filter(s => s.brandId.toString() === form.brandId.toString())
                .map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="field">
            <label>Modelo</label>
            <input
              value={form.model}
              onChange={e => setForm({ ...form, model: e.target.value })}
              placeholder="Informe o modelo"
            />
          </div>

          <div className="field">
            <label>Versão</label>
            <input
              value={form.version}
              onChange={e => setForm({ ...form, version: e.target.value })}
              placeholder="Informe a versão"
            />
          </div>

          <div className="field">
            <label>Ano Fabricação/Modelo</label>
            <input
              value={form.year}
              onChange={e => setForm({ ...form, year: e.target.value })}
              placeholder="Ex: 2018/2019"
            />
          </div>

          <div className="field">
            <label>Quilometragem</label>
            <input
              value={form.mileage}
              onChange={e => setForm({ ...form, mileage: e.target.value })}
              placeholder="Informe a quilometragem"
            />
          </div>

          <div className="field">
            <label>Valor</label>
            <input
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="Informe o valor"
            />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Descrição"
            />
          </div>

          <div className="field">
            <label>Upload imagens</label>
            <div
              className="upload-area"
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
            >
              <div className="thumbs">
                {(form.images || []).map((it:any, i:number) => (
                  <div key={i} className="thumb">
                    <img src={typeof it === 'string' ? it : URL.createObjectURL(it)} alt={`img-${i}`} />
                    <button type="button" className="remove" onClick={() => removeImageAt(i)}>✕</button>
                  </div>
                ))}

                <div className="thumb add" onClick={() => fileInputRef.current?.click()}>
                  <div className="plus">+</div>
                </div>
              </div>
              <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handlePickFiles} />
            </div>
          </div>

          <div className="footer-actions">
            <div>
              {id ? (
                <button
                  type="button"
                  className="btn danger"
                  onClick={remove}
                >
                  Excluir
                </button>
              ) : (
                <div style={{ width: 92 }} />
              )}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" className="btn cancel" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button className="btn save" type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
