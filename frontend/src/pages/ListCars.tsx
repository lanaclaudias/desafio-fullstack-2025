import React, { useEffect, useState } from 'react'
import api from '../api'
import CarForm from './CarForm'

export default function CarList() {
  const [cars, setCars] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const [visibleIdx, setVisibleIdx] = useState<Record<string, number>>({})
  const slidesRefs = React.useRef<Record<string, HTMLDivElement | null>>({})

  const load = () => api.get('/cars').then(r => setCars(r.data.data || []))

  useEffect(() => { load() }, [])


  useEffect(() => {
    const map: Record<string, number> = {}
    cars.forEach(c => { map[c.id] = 0 })
    setVisibleIdx(map)
  }, [cars])

 
  useEffect(() => {
    Object.entries(visibleIdx).forEach(([carId, idx]) => {
      const el = slidesRefs.current[carId]
      if (!el) return
      const child = el.children[idx] as HTMLElement | undefined
      if (child && typeof child.scrollIntoView === 'function') {
        child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    })
  }, [visibleIdx])


  const handlePointerMove = (clientX: number, el: HTMLElement, carId: any, total: number) => {
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const idx = Math.floor(pct * total)
    setVisibleIdx(s => ({ ...s, [carId]: idx }))
  }

  const onMouseMoveSlide = (e: React.MouseEvent<HTMLDivElement>, carId: any, total: number) => {
    const el = e.currentTarget as HTMLElement
    handlePointerMove(e.clientX, el, carId, total)
  }

  const onTouchMoveSlide = (e: React.TouchEvent<HTMLDivElement>, carId: any, total: number) => {
    if (!e.touches || e.touches.length === 0) return
    const t = e.touches[0]
    const el = e.currentTarget as HTMLElement
    handlePointerMove(t.clientX, el, carId, total)
  }


  const dragStateRef = React.useRef<{ carId?: any, startX?: number, lastIdx?: number } | null>(null)

  const onMouseDownSlide = (e: React.MouseEvent<HTMLDivElement>, carId: any, total: number) => {
    e.preventDefault()
    dragStateRef.current = { carId, startX: e.clientX, lastIdx: visibleIdx[carId] || 0 }
  }

  const onMouseMoveDocument = (e: MouseEvent) => {
    const st = dragStateRef.current
    if (!st || st.carId === undefined) return
    const delta = e.clientX - (st.startX || 0)
    const threshold = 30
    if (Math.abs(delta) > threshold) {
      const imgs = (cars.find(c => c.id === st.carId)?.images || [])
      const total = Math.max(1, imgs.length)
      let newIdx = st.lastIdx || 0
      if (delta > 0) newIdx = Math.max(0, newIdx - 1)
      else newIdx = Math.min(total - 1, newIdx + 1)
      dragStateRef.current = { ...st, lastIdx: newIdx, startX: e.clientX }
      setVisibleIdx(s => ({ ...s, [st.carId]: newIdx }))
    }
  }

  const onMouseUpDocument = () => { dragStateRef.current = null }

  React.useEffect(() => {
    document.addEventListener('mousemove', onMouseMoveDocument)
    document.addEventListener('mouseup', onMouseUpDocument)
    return () => {
      document.removeEventListener('mousemove', onMouseMoveDocument)
      document.removeEventListener('mouseup', onMouseUpDocument)
    }
  }, [cars, visibleIdx])

  const onTouchStartSlide = (e: React.TouchEvent<HTMLDivElement>, carId: any) => {
    const t = e.touches[0]
    dragStateRef.current = { carId, startX: t.clientX, lastIdx: visibleIdx[carId] || 0 }
  }

  const onTouchMoveDocument = (e: TouchEvent) => {
    const st = dragStateRef.current
    if (!st) return
    const t = e.touches[0]
    const delta = t.clientX - (st.startX || 0)
    const threshold = 30
    if (Math.abs(delta) > threshold) {
      const imgs = (cars.find(c => c.id === st.carId)?.images || [])
      const total = Math.max(1, imgs.length)
      let newIdx = st.lastIdx || 0
      if (delta > 0) newIdx = Math.max(0, newIdx - 1)
      else newIdx = Math.min(total - 1, newIdx + 1)
      dragStateRef.current = { ...st, lastIdx: newIdx, startX: t.clientX }
      setVisibleIdx(s => ({ ...s, [st.carId]: newIdx }))
    }
  }

  React.useEffect(() => {
    document.addEventListener('touchmove', onTouchMoveDocument, { passive: true })
    return () => document.removeEventListener('touchmove', onTouchMoveDocument)
  }, [cars, visibleIdx])

  return (
    <div className="app">

      <aside className={`sidebar ${menuOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          {menuOpen ? (
            <img src="/logo-1.png" alt="Logo aberto" className="logo1" />
          ) : (
            <img src="/logo.jpg" alt="Logo" className="logo" />
          )}
          <button className="toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '«' : '»'}
          </button>
        </div>
        <p>Menu</p>
        <nav className="menu">
          <button className="menu-item">

        <span className="material-icons">home</span>
            {menuOpen && <span className="label">Home</span>}
          </button>
        </nav>
      </aside>


      <main className="content">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <button className="btn add" onClick={() => { setEditId(null); setShowForm(true) }}>
            + Adicionar veículo
          </button>
        </div>

        <div className="grid">
          {cars.map(car => (
            <div key={car.id} className="card-car">
              <div className="card-image">

                {(() => {
                  const imgs = (car.images && car.images.length) ? car.images : ['/placeholder.jpg']
                  const total = imgs.length
                  const idx = visibleIdx[car.id] || 0
                  return (
                    <div
                      className="slides"
                      ref={el => { slidesRefs.current[car.id] = el }}
                      onMouseMove={(e) => onMouseMoveSlide(e, car.id, total)}
                      onTouchMove={(e) => onTouchMoveSlide(e, car.id, total)}
                    >
                      {imgs.map((src: string, i: number) => (
                        <div key={i} className={`slide ${i === idx ? 'active' : ''}`}> 
                          <img src={src} alt={car.model} />
                        </div>
                      ))}
                    </div>
                  )
                })()}

                <div className="dots">
                  {((car.images && car.images.length) ? car.images : ['/placeholder.jpg']).map((_src: any, i: number) => {
                    const idx = visibleIdx[car.id] || 0
                    return (
                      <button key={i} className={`dot ${i === idx ? 'active' : ''}`} onClick={() => setVisibleIdx(s => ({ ...s, [car.id]: i }))} />
                    )
                  })}
                </div>
              </div>

              <div className="card-body">

                <div className="card-header">
                  <h3 className="car-title">{car.model}</h3>
                  <span className="car-meta">{car.year}     {car.mileage} Km</span>
                </div>


                <div className="car-version">{car.version}</div>


                <div className="car-location">
                  <span className="location-icon" aria-hidden>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="black"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C8.1 2 5 5.1 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
                    </svg>

                  </span>
                  <span className="location-text">{car.store?.name}</span>
                </div>


                <div className="price">R${Number(car.price).toLocaleString()}</div>
              </div>

              <div className="card-foot">
                <button
                  className="icon-btn"
                  title="Configurações"
                  onClick={() => { setEditId(car.id); setShowForm(true) }}
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-gear"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06c.46-.46.61-1.14.33-1.82a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09c.7 0 1.31-.4 1.51-1a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06c.46.46 1.14.61 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09c0 .7.4 1.31 1 1.51.68.28 1.36.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.46.46-.61 1.14-.33 1.82.2.6.81 1 1.51 1H21a2 2 0 0 1 0 4h-.09c-.7 0-1.31.4-1.51 1z" />
                  </svg>
                </button>

                <button className="btn buy">Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </main>


      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CarForm id={editId} onClose={() => setShowForm(false)} onSaved={load} />
          </div>
        </div>
      )}


      <style>
         <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>{`
        .app {
          display: flex;
          min-height: 100vh;
          background: #e6efe9;
        }


        .sidebar {
          background: #fff;
          border-right: 1px solid #ddd;
          padding: 10px;
          transition: width 0.3s;
          overflow: hidden;
        }
        .sidebar.collapsed { width: 100px; }
        .sidebar.open { width: 200px; }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .logo { height: 30px; margin-left: 5px; }
  .logo-compact { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; }
  .logo-alt { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; }
        .toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 30px;
        }
           .logo1 { height: 100px; margin-left: 5px; }
  .logo-compact { width: 100px; height: 36px; display: inline-flex; align-items: center; justify-content: center; margin-left: 4px; }
  .logo-alt { width: 100px; height: 100px; display: inline-flex; align-items: center; justify-content: center; }
        .toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 30px;
        }
        .menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border: none;
          background: #f8f8f8;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }
        .menu-item:hover { background: #e0e0e0; }

      
        .content { flex: 1; padding: 10px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

              .card-car {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .card-image img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
  .card-image { position: relative; }
  .card-image .slides {
    display: flex;
    gap: 12px;
    height: 180px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding: 0 12px;
    box-sizing: border-box;
  }
  .card-image .slides { cursor: grab; user-select: none; -webkit-user-select: none; -ms-user-select: none; }
  .card-image .slides .slide {
    flex: 0 0 80%;
    scroll-snap-align: center;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .card-image .slides .slide img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .card-image .dots { position: absolute; left: 50%; transform: translateX(-50%); bottom: 8px; display:flex; gap:8px; }
  .dot { width:8px; height:8px; border-radius:50%; background:#ddd; border:none; padding:0; cursor:pointer; }
  .dot.active { background:#006d4d; box-shadow: 0 0 0 3px rgba(0,109,77,0.08); }
  .card-image .slides:active { cursor: grabbing; }
        .card-body { padding: 14px; }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-size: 20px;
        }
          .card-image .slides img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: none;
}
  
.card-image .slides img.active {
  display: block; 
}
        .car-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        .car-meta {
          font-size: 16px;
          color: #666;
        }
        .car-version {
          font-size: 13px;
          font-weight: 500;
          color: #707070ff
          margin-bottom: 6px;
        }
        .car-location {
          font-size: 13px;
          color: #444;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .car-location .location-icon { display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; }
        .car-location .location-icon svg { width: 18px; height: 18px; }
        .car-location .location-text { color: #444; }
        .price {
          font-size: 40px;
          font-weight: bold;
          color: #000000ff;
          margin-top: 8px;
        }

        .card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
        }


        .btn {
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .btn.add {
          background: #006d4d;
          color: #fff;
          border-radius: 28px;
          padding: 10px 20px;
        }
        .btn.buy {
          background: #006d4d;
          color: #fff;
          border-radius: 20px;
          padding: 8px 18px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn.buy::before { content: "🛒";
          font-size: 16px;
          color: #ffffffff;}

      
        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover { background: #f0f0f0; }
        .icon-gear { width: 20px; height: 20px; stroke: #333; }


        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          width: 500px;
          max-width: 90%;
        }
  
      `}</style>
    </div>
  )
}
