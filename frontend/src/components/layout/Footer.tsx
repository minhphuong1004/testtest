import React from "react";
import { AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-space-800 bg-space-950/90 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Scientific & Data Provenance Notice */}
        <div className="mb-8 rounded-xl border border-space-800 bg-space-900/60 p-4 sm:p-6 backdrop-blur">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-400" />
            <div className="space-y-2 text-xs leading-relaxed text-slate-300">
              <p className="font-semibold text-slate-100 uppercase tracking-wide">
                Scientific Integrity & Data Attribution Notice
              </p>
              <p>
                <strong>Aerosol Optical Depth (AOD) vs. AQI:</strong> AOD is a dimensionless physical
                measure of total column light extinction caused by suspended particles (aerosols) in the atmosphere.
                Under scientific guidelines, AOD must <em>never</em> be presented as or conflated with the Air Quality Index (AQI),
                which is calculated from ground-level concentrations of particulate matter (PM2.5, PM10) and trace gases.
              </p>
              <p>
                <strong>Mock Data Disclaimer:</strong> When prototype mock data is active, values and imagery are synthetic
                placeholders created to support UI and audio engine integration. They do not represent real-time or historical
                scientific facts from NASA missions. Verified observations must be sourced through NASA Earthdata and GIBS.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Attribution */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">BREATHE</h4>
            <p className="text-xs leading-5 text-slate-400">
              An interactive Earth science sonification experience built for the NASA Space Apps
              Challenge 2026 – The Earth Information Jukebox.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              NASA Data Sources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://earthdata.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  NASA Earthdata <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://worldview.earthdata.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  NASA Worldview (GIBS) <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://earth.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  NASA Earth Information Center <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Team Workstreams
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>N01 – Data Engineering</li>
              <li>N02 – Scientific Research</li>
              <li>N03 – Sonification</li>
              <li>N04 – Frontend Development</li>
              <li>N05 – UI/UX & Storytelling</li>
              <li>N06 – Integration, QA & Submission</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Open Science & Licensing
            </h4>
            <p className="text-xs leading-5 text-slate-400">
              Developed in accordance with NASA Open Science Guidelines. Code and documentation
              released under the MIT License.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>NASA Space Apps 2026 Compliant</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-space-800/80 pt-6 text-center text-xs text-slate-400">
          <p>© 2026 BREATHE Project Team. Built for NASA Space Apps Challenge.</p>
        </div>
      </div>
    </footer>
  );
};
