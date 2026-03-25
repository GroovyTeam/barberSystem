export default function TopAppBar({ title = 'Black & Blade', showNotification = true }) {
  return (
    <header className="bg-[#131313] fixed top-0 w-full z-50">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#51443a]/30 bg-[#201f1f] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#f9ba82] text-lg">content_cut</span>
          </div>
          <h1 className="font-headline font-bold tracking-tight text-xl text-[#E5E2E1]">
            {title}
          </h1>
        </div>
        {showNotification && (
          <button className="text-[#F9BA82] relative">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#f9ba82] rounded-full border-2 border-[#131313]"></span>
          </button>
        )}
      </div>
      <div className="bg-[#1C1B1B] h-px w-full" />
    </header>
  )
}
