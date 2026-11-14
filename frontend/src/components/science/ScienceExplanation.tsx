"use client";

import React, { useState } from "react";
import { AlertTriangle, BookOpen, ChevronDown, ChevronUp, Database, Music, Orbit } from "lucide-react";

export const ScienceExplanation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("aod-vs-aqi");

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? "" : id);
  };

  return (
    <div id="science" className="rounded-2xl border border-space-800 bg-space-900/90 p-4 sm:p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-space-800 text-cyan-400">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Scientific Context & Sonification Mapping
          </h3>
          <p className="text-xs text-slate-400">
            Workstream N02 (Scientific Research) documentation & validation guide.
          </p>
        </div>
      </div>

      {/* Primary Science Warning Card: AOD != AQI */}
      <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1.5 text-xs text-amber-200">
            <h4 className="font-bold uppercase tracking-wide text-amber-300">
              Crucial Scientific Distinction: AOD is NOT Air Quality Index (AQI)
            </h4>
            <p className="leading-relaxed">
              <strong>Aerosol Optical Depth (AOD)</strong> is a dimensionless physical quantity that measures
              how much direct sunlight is scattered or absorbed by solid and liquid particles (dust, smoke,
              sea salt, volcanic ash, sulfates) suspended across the <em>entire vertical column</em> of the atmosphere.
            </p>
            <p className="leading-relaxed">
              In contrast, <strong>Air Quality Index (AQI)</strong> is a regulatory public health metric
              derived from <em>ground-level</em> concentrations of particulate matter (PM2.5, PM10) and gases (O3, NO2, SO2, CO).
              A dense smoke plume transported high in the troposphere (e.g., 8 km altitude) creates high AOD values
              while surface sensors may record low ground-level PM2.5. Conflating column AOD with AQI is scientifically invalid.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Accordion Sections */}
      <div className="space-y-3">
        {/* Section 1: How NASA Measures Aerosols */}
        <div className="rounded-xl border border-space-800 bg-space-950/70 overflow-hidden">
          <button
            onClick={() => toggleSection("sensors")}
            className="flex w-full items-center justify-between p-4 text-left font-medium text-slate-200 hover:text-cyan-400 transition"
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Orbit className="h-4 w-4 text-cyan-400" />
              1. Satellite Observation: MODIS & VIIRS Instruments
            </span>
            {activeSection === "sensors" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {activeSection === "sensors" && (
            <div className="border-t border-space-800 p-4 text-xs leading-relaxed text-slate-300 space-y-2">
              <p>
                NASA observes atmospheric aerosols globally using spectroradiometers aboard polar-orbiting satellites:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>
                  <strong>MODIS (Moderate Resolution Imaging Spectroradiometer):</strong> Operating on NASA&apos;s
                  Terra and Aqua satellites since 1999 and 2002, measuring aerosol optical thickness at 550 nm.
                </li>
                <li>
                  <strong>VIIRS (Visible Infrared Imaging Radiometer Suite):</strong> Aboard the Suomi NPP and NOAA-20/21
                  satellites, providing continued high-resolution global aerosol monitoring.
                </li>
              </ul>
              <p>
                Dark Target and Deep Blue retrieval algorithms calculate optical depth by comparing radiance reflected
                from the Earth&apos;s surface and atmosphere against radiative transfer models.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Sonification Mapping Justification */}
        <div className="rounded-xl border border-space-800 bg-space-950/70 overflow-hidden">
          <button
            onClick={() => toggleSection("sonification-mapping")}
            className="flex w-full items-center justify-between p-4 text-left font-medium text-slate-200 hover:text-cyan-400 transition"
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Music className="h-4 w-4 text-cyan-400" />
              2. Sonification Architecture: Acoustic Mapping Rationale
            </span>
            {activeSection === "sonification-mapping" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {activeSection === "sonification-mapping" && (
            <div className="border-t border-space-800 p-4 text-xs leading-relaxed text-slate-300 space-y-2">
              <p>
                Human auditory perception can detect subtle micro-fluctuations in frequency, timbre, and harmony.
                BREATHE maps atmospheric physical metrics as follows:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-space-800 bg-space-900/60 p-3">
                  <h5 className="font-semibold text-cyan-400 mb-1">Pitch / Frequency (Hz)</h5>
                  <p className="text-[11px] text-slate-400">
                    Linear mapping between AOD 0.05 and 1.25 to fundamental frequencies between 130.8 Hz (C3) and 523.3 Hz (C5).
                    Denser particulate loads produce higher acoustic tension.
                  </p>
                </div>
                <div className="rounded-lg border border-space-800 bg-space-900/60 p-3">
                  <h5 className="font-semibold text-cyan-400 mb-1">Harmonic Overtones & Timbre</h5>
                  <p className="text-[11px] text-slate-400">
                    As optical extinction increases, a secondary overtone (perfect fifth) is introduced with variable gain,
                    mirroring how light diffusion causes multiple scattering events in hazy air.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Traceable NASA Data Provenance */}
        <div className="rounded-xl border border-space-800 bg-space-950/70 overflow-hidden">
          <button
            onClick={() => toggleSection("provenance")}
            className="flex w-full items-center justify-between p-4 text-left font-medium text-slate-200 hover:text-cyan-400 transition"
          >
            <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Database className="h-4 w-4 text-cyan-400" />
              3. Data Provenance & Traceability Requirements
            </span>
            {activeSection === "provenance" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {activeSection === "provenance" && (
            <div className="border-t border-space-800 p-4 text-xs leading-relaxed text-slate-300 space-y-2">
              <p>
                All data ingested into BREATHE must adhere to the data provenance protocol defined in{" "}
                <code className="text-cyan-300 font-mono">docs/DATA_CONTRACT.md</code>:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>Every observation must cite its source instrument, satellite mission, and processing level.</li>
                <li>Timestamps must be standardized in ISO 8601 UTC.</li>
                <li>Observations must include traceable URLs to NASA Earthdata or GIBS endpoint services.</li>
                <li>Prototype or synthetic datasets must be unambiguously flagged with <code className="text-cyan-300">isMock: true</code>.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
