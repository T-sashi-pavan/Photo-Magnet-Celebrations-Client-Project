interface HeroSectionProps {
  onStartDesigning: () => void;
}

export default function HeroSection({ onStartDesigning }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Turn Your Memories Into Beautiful Photo Magnets
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Custom fridge magnets with your favorite photos. High quality, affordable prices, and delivered right to your door.
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <div className="font-semibold">Premium Quality</div>
                  <div className="text-sm text-blue-100">Durable & vibrant prints</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <div className="font-semibold">Fast Delivery</div>
                  <div className="text-sm text-blue-100">Telangana & Andhra Pradesh</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <div className="font-semibold">Best Prices</div>
                  <div className="text-sm text-blue-100">Starting from ₹229</div>
                </div>
              </div>
            </div>

            <button
              onClick={onStartDesigning}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Designing Your Magnet
            </button>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6">Our Products</h3>
              
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="font-semibold text-lg mb-1">Square Photo Magnets</div>
                  <div className="text-blue-100 text-sm mb-2">Without Stand - 4 to 10 pieces</div>
                  <div className="text-2xl font-bold">₹399 - ₹849</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="font-semibold text-lg mb-1">Rectangle Photo Magnets</div>
                  <div className="text-blue-100 text-sm mb-2">With Premium Acrylic Stand</div>
                  <div className="text-2xl font-bold">₹259 - ₹819</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="font-semibold text-lg mb-1">Rectangle Photo Magnets</div>
                  <div className="text-blue-100 text-sm mb-2">Without Stand - Classic option</div>
                  <div className="text-2xl font-bold">₹229 - ₹649</div>
                </div>
                
                <div className="bg-white/20 rounded-lg p-4 border-2 border-yellow-400">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-semibold text-lg">Live Photo Magnet Stall</div>
                    <span className="text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded font-bold">EVENT SPECIAL</span>
                  </div>
                  <div className="text-blue-100 text-sm mb-2">Perfect for weddings & events</div>
                  <div className="text-2xl font-bold">₹99/piece (Min 100 pcs)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
