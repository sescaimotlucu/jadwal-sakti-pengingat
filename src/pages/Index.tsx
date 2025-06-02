
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-yellow-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="text-3xl text-white">📱</i>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistem Pengingat Jadwal Otomatis</h1>
          <p className="text-xl text-gray-600 mb-8">Solusi modern untuk pengingat kegiatan komunitas via WhatsApp</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="text-2xl mb-3">⏰</div>
              <h3 className="font-semibold text-gray-800 mb-2">Pengingat Otomatis</h3>
              <p className="text-gray-600 text-sm">Kirim pengingat H-2, H-1, dan hari-H secara otomatis</p>
            </div>
            <div className="p-6 bg-yellow-50 rounded-xl">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-800 mb-2">Dashboard Lengkap</h3>
              <p className="text-gray-600 text-sm">Pantau semua aktivitas dan statistik pengiriman</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl">
              <div className="text-2xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-800 mb-2">Integrasi WhatsApp</h3>
              <p className="text-gray-600 text-sm">Kirim pesan langsung ke nomor warga</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <a 
              href="/index.html" 
              className="inline-block bg-gradient-to-r from-green-400 to-yellow-300 text-white font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Mulai Menggunakan
            </a>
            <div className="text-sm text-gray-500">
              Sistem siap pakai untuk komunitas warga
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
