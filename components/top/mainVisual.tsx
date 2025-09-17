import Image from 'next/image'

const MainVisual = () => {
  return (
    <div className="relative w-full">
      {/* 背景画像 */}
      <div className="hidden md:block aspect-video xl:h-[600px]">
        <Image
          src="/images/top/pc/mv01.png"
          alt="MoveBid - 引越しオークション"
          fill
          className="object-cover blur-[3px]"
        />
      </div>
      <div className="md:hidden aspect-[4/3]">
        <Image
          src="/images/top/sp/mv01.png"
          alt="MoveBid - 引越しオークション"
          fill
          className="object-cover blur-[3px]"
        />
      </div>

      {/* オーバーレイとコンテンツ */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-[#003672]">Move</span>
            <span className="text-[#5c6f8b]">Bid</span>
          </h1>
          <p className="text-lg md:text-2xl mb-2 font-medium">引越し業者が競争入札</p>
          <p className="text-base md:text-xl mb-8">最安値で理想の引越しを実現</p>
        </div>
      </div>
    </div>
  )
}

export default MainVisual
