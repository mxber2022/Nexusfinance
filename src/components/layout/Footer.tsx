import React from 'react';
import { Fuel, Github, Twitter, Globe, Zap, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4 group">
                <div className="flex items-center justify-center w-8 h-8 bg-black border border-gray-600 rounded-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                  <div className="w-3 h-3 bg-gray-800 rounded-sm border border-gray-700"></div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
                    NexusFinance
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">Cross-Chain DeFi Hub</div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-md">
                Cross-chain DeFi hub powered by Avail Nexus SDK. 
                Refuel gas instantly and optimize yields with unified cross-chain actions.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-3">
                <a href="#" className="group p-2.5 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Github className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="#" className="group p-2.5 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Twitter className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
                <a href="#" className="group p-2.5 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                  <Globe className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </a>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center lg:text-right space-y-4">
              <div className="group">
                <h4 className="text-base font-medium text-gray-200 mb-2 group-hover:text-white transition-colors duration-300">
                  Cross-Chain DeFi Hub
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Gas refueling and yield optimization across all chains
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-400">Powered by</div>
                <div className="flex items-center justify-center lg:justify-end space-x-4">
                  <span className="text-sm font-medium text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-default">Avail Nexus</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-400 hover:text-green-400 transition-colors duration-300 cursor-default">Cross-Chain</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 border-t border-white/15 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <div className="text-gray-400 text-xs hover:text-gray-300 transition-colors duration-300">
                © 2024 NexusFinance. Built for the future of cross-chain DeFi.
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors duration-300 group cursor-default">
                  <Fuel className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                  <span>Cross-Chain</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400 hover:text-emerald-300 transition-colors duration-300 group cursor-default">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse group-hover:animate-ping"></div>
                  <span>Nexus Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}