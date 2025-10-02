import React, { useState, useRef, useEffect } from 'react';

// Tipe data Misi tidak berubah
type Misi = {
  id: number;
  task: string;
  description: string;
  is_completed: boolean;
};

// Data awal tidak berubah
const initialMisi: Misi[] = [
  { id: 1, task: "Install aplikasi ini", description: "Klik tombol install di address bar browser untuk menambahkan ke home screen.", is_completed: false },
];

const CheckboxIcon = ({ completed }: { completed: boolean }) => (
  <div className={`w-7 h-7 border-2 rounded-md flex items-center justify-center transition-all ${
    completed ? 'bg-habitica-blue border-habitica-blue' : 'border-gray-300 bg-white'
  }`}>
    {completed && (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
      </svg>
    )}
  </div>
);

function App() {
  // Semua state dan fungsi di bagian atas ini tidak ada yang berubah.
  // ... (useState, useRef, useEffect, dan semua fungsi handle... sama seperti sebelumnya)
  const [misiList, setMisiList] = useState<Misi[]>(() => {
    try {
      const dataTersimpan = localStorage.getItem('daftarMisi-rpg-v1');
      return dataTersimpan ? JSON.parse(dataTersimpan) : initialMisi;
    } catch (error) {
      console.error("Gagal memuat data dari localStorage", error);
      return initialMisi;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('daftarMisi-rpg-v1', JSON.stringify(misiList));
    } catch (error) {
      console.error("Gagal menyimpan data ke localStorage", error);
    }
  }, [misiList]);

  const [inputJudul, setInputJudul] = useState('');
  const [inputDeskripsi, setInputDeskripsi] = useState('');
  const [misiTerpilihId, setMisiTerpilihId] = useState<number | null>(null);
  const [misiYangDieditId, setMisiYangDieditId] = useState<number | null>(null);
  const [editJudul, setEditJudul] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const mainRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (misiTerpilihId !== null) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [misiTerpilihId]);

  const handleTambahMisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputJudul.trim() === '') return;
    const misiBaru: Misi = { id: Date.now(), task: inputJudul, description: inputDeskripsi, is_completed: false };
    setMisiList([misiBaru, ...misiList]);
    setInputJudul('');
    setInputDeskripsi('');
  };
  const handleToggleSelesai = (id: number) => { setMisiList(misiList.map(misi => misi.id === id ? { ...misi, is_completed: !misi.is_completed } : misi)); };
  const handleHapusMisi = (id: number) => { setMisiList(misiList.filter(misi => misi.id !== id)); if (misiTerpilihId === id) { setMisiTerpilihId(null); } };
  const handleLihatDetail = (id: number) => { setMisiTerpilihId(id); };
  const handleTutupDetail = () => { setMisiTerpilihId(null); };
  const handleMulaiEdit = (misi: Misi) => { setMisiYangDieditId(misi.id); setEditJudul(misi.task); setEditDeskripsi(misi.description); };
  const handleSimpanEdit = (e: React.FormEvent) => { e.preventDefault(); if (editJudul.trim() === '') return; setMisiList(misiList.map(misi => misi.id === misiYangDieditId ? { ...misi, task: editJudul, description: editDeskripsi } : misi)); setMisiYangDieditId(null); };
  const misiTerpilih = misiList.find(misi => misi.id === misiTerpilihId);

  // JSX di bawah ini tidak berubah kecuali di bagian Tampilan Detail Misi
  return (
    <div className="bg-habitica-purple min-h-screen text-gray-800">
      <div ref={mainRef} className="container mx-auto max-w-xl p-4 pb-48"> {/* Tambah padding-bottom agar konten terakhir tidak tertutup panel detail */}
        <header className="text-center my-8">
          <h1 className="text-5xl font-bold text-white">Todolist</h1>
          <p className="text-white/70 mt-2">Selesaikanlah semua <b>Rencanamu</b> dan jalanilah hari yang <b>Produktif!</b></p>
        </header>
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-6 shadow-lg">
          <form className="flex flex-col gap-3" onSubmit={handleTambahMisi}>
            <input type="text" placeholder="Rencanamu..." className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-habitica-blue transition" value={inputJudul} onChange={(e) => setInputJudul(e.target.value)} />
            <textarea placeholder="Deskripsi (opsional)..." className="w-full p-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-habitica-blue transition" rows={2} value={inputDeskripsi} onChange={(e) => setInputDeskripsi(e.target.value)} />
            <button type="submit" className="bg-habitica-blue text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed self-end" disabled={inputJudul.trim() === ''}>Tambah Misi</button>
          </form>
        </div>
        <main className="space-y-3">
          {misiList.map((misi) => (
            <div key={misi.id}>
              {misiYangDieditId === misi.id ? (
                <form onSubmit={handleSimpanEdit} className="bg-white rounded-lg p-4 shadow-lg space-y-3">
                  <input type="text" value={editJudul} onChange={(e) => setEditJudul(e.target.value)} className="w-full text-lg p-2 bg-yellow-100 border-2 border-yellow-300 rounded-md" />
                  <textarea value={editDeskripsi} onChange={(e) => setEditDeskripsi(e.target.value)} className="w-full p-2 bg-yellow-100 border-2 border-yellow-300 rounded-md" rows={3} />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setMisiYangDieditId(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Batal</button>
                    <button type="submit" disabled={editJudul.trim() === ''} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400">Simpan</button>
                  </div>
                </form>
              ) : (
                <div className={`bg-white rounded-lg p-4 flex items-center gap-4 shadow transition-all ${misi.is_completed ? 'opacity-60' : ''} ${misiTerpilihId === misi.id ? 'ring-4 ring-yellow-400' : ''}`}>
                  <button onClick={() => handleToggleSelesai(misi.id)}><CheckboxIcon completed={misi.is_completed} /></button>
                  <p onClick={() => handleLihatDetail(misi.id)} className={`flex-grow text-lg cursor-pointer ${misi.is_completed ? 'line-through text-gray-400' : ''}`}>{misi.task}</p>
                  <div className="flex gap-1">
                    <button onClick={() => handleMulaiEdit(misi)} className="text-gray-400 hover:text-blue-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></button>
                    <button onClick={() => handleHapusMisi(misi.id)} className="text-gray-400 hover:text-red-500 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>
      </div>

      {/* Tampilan Detail Misi */}
      {misiTerpilih && (
        // --- INILAH PERBAIKAN UTAMANYA ---
        <div ref={detailRef} className="fixed bottom-0 left-0 right-0 w-full bg-white shadow-2xl rounded-t-2xl border-t-4 border-yellow-400">
          <div className="container mx-auto max-w-xl p-6 relative">
            <button onClick={handleTutupDetail} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-3xl font-bold mb-2">{misiTerpilih.task}</h2>
            <div className="max-h-48 overflow-y-auto pr-2">
              <p className="text-gray-600 whitespace-pre-wrap break-words">{misiTerpilih.description || "Tidak ada deskripsi."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;