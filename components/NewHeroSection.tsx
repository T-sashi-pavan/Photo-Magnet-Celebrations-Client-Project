'use client';

import { ArrowRight, Sparkles, Gift, Truck, Camera, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NewHeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-stone-200 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative">
      {/* Main Hero */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
                <span className="px-5 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-900 rounded-full text-sm font-bold border-2 border-amber-300 shadow-sm">
                  Photo Magnet Celebrations
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Capture Every
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-amber-600">
                  Special Moment
                </span>
                With Custom Magnets
              </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              Perfect for Weddings, Birthdays, Schools, Colleges & Events. 
              Thick, Premium, High Quality Magnets with Instant Printing!
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center shadow-md">
                  <Camera className="text-amber-800" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Live Photo Capture</p>
                  <p className="text-sm text-gray-600">Instant Printing</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-200 rounded-lg flex items-center justify-center shadow-md">
                  <Zap className="text-orange-800" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Premium Quality</p>
                  <p className="text-sm text-gray-600">Thick Magnets</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-stone-100 to-amber-200 rounded-lg flex items-center justify-center shadow-md">
                  <Gift className="text-stone-800" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Perfect Gift</p>
                  <p className="text-sm text-gray-600">All Events</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-200 rounded-lg flex items-center justify-center shadow-md">
                  <Award className="text-amber-800" size={24} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Best Prices</p>
                  <p className="text-sm text-gray-600">From ₹99</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products/square"
                className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold text-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Shop Square Magnets
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products/rectangle"
                className="px-8 py-4 bg-white text-amber-700 border-2 border-amber-600 rounded-lg font-semibold text-lg hover:bg-amber-50 transition-all inline-flex items-center gap-2"
              >
                Shop Rectangle Magnets
              </Link>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 border-4 border-amber-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/PHOTOS/LANDINGPAGE5.jpeg"
                    alt="Square Photo Magnet ExampleIII"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/PHOTOS/LANDINGPAGE2.jpeg"
                    alt="Square Photo Magnet Example"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/PHOTOS/LANDINGPAGE3.jpeg"
                    alt="Square Photo Magnet Example"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/PHOTOS/LANDINGPAGE4.jpeg"
                    alt="Square Photo Magnet Example"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-300 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-300 rounded-full opacity-50 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Product Categories Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Choose Your Magnet Style
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Square Magnets Card */}
          <Link href="/products/square">
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer border-2 border-amber-100 hover:border-amber-300">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="p-8">
                <div className="w-full aspect-square bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl overflow-hidden mb-6 border-2 border-amber-200">
                  <Image
                    src="/PHOTOS/SQUARE1.png"
                    alt="Square Photo Magnet Example"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Square Photo Magnets</h3>
                <p className="text-gray-600 mb-4">Perfect for your fridge. Classic 2" × 2" square design.</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    <span>Starting from <strong>₹99</strong> per piece</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    <span>Volume discounts available</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                    <span>Thick premium quality</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-amber-700 font-semibold group-hover:underline">Shop Now</span>
                  <ArrowRight className="text-amber-700 group-hover:translate-x-2 transition-transform" size={20} />
                </div>
              </div>
            </div>
          </Link>

          {/* Rectangle Magnets Card */}
          <Link href="/products/rectangle">
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer border-2 border-stone-100 hover:border-stone-300">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-600 via-amber-600 to-stone-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              
              <div className="p-8">
                <div className="w-full aspect-square bg-gradient-to-br from-stone-50 to-amber-100 rounded-xl overflow-hidden mb-6 border-2 border-stone-200">
                  <Image
                    src="/PHOTOS/SQUARE2.png"
                    alt="Rectangle Photo Magnet Example"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Rectangle Photo Magnets</h3>
                <p className="text-gray-600 mb-4">Premium acrylic magnets. Portrait & Landscape options.</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-stone-600 rounded-full"></span>
                    <span>With stand from <strong>₹259</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-stone-600 rounded-full"></span>
                    <span>Without stand from <strong>₹229</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-stone-600 rounded-full"></span>
                    <span>Multiple orientations</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-700 font-semibold group-hover:underline">Shop Now</span>
                  <ArrowRight className="text-stone-700 group-hover:translate-x-2 transition-transform" size={20} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
     
      </div>
    </div>
  );
}
