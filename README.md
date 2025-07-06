# Sustainability Footprint Estimator

A robust, professional, and privacy-first Progressive Web App (PWA) to estimate, analyze, and optimize the energy consumption and CO₂ footprint of your devices. Designed for individuals, households, and organizations who want actionable insights and a lower environmental impact—completely free and open source.

---

## 🌟 Features
- **Device Management:** Add, edit, remove, import/export devices (pre-populated and custom)
- **Energy & CO₂ Calculation:** Accurate, region-aware calculations (with live emission factors)
- **What-if Scenarios:** Simulate device/usage changes before saving
- **Lifecycle Impact:** Manufacturing/disposal CO₂ for each device
- **Renewable Offset:** Input solar/wind usage, see net CO₂
- **Benchmarks:** Compare your footprint to national/global averages
- **Results Visualization:** Pie, bar, and line charts for breakdowns and trends
- **Historical Tracking:** Save and view your footprint over time
- **Data Import/Export:** JSON/CSV for devices and results
- **Live Emission Factors:** Real-time CO₂/kWh via open APIs
- **Energy Price Data:** See estimated cost and savings
- **Accessibility:** Full a11y, keyboard navigation, skip links
- **Multi-language:** English, Spanish (easy to add more)
- **Dark/Light Mode:** Theme toggle, auto-persisted
- **Responsive Design:** Works beautifully on desktop, tablet, and mobile
- **Privacy-first:** 100% local, no tracking, no cloud required
- **PWA:** Installable on desktop/mobile, offline support

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or v20 (LTS recommended)
- **npm** (comes with Node.js)

### Setup
```bash
cd sustainability-footprint
npm install --legacy-peer-deps
npm start
```
- Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production
```bash
npm run build
```
- Output is in the `build/` directory.

---

## 📱 PWA Install
- Click the install button in your browser (Chrome/Edge/Firefox) or "Add to Home Screen" on mobile.
- Works offline and can be pinned to your desktop or phone.

---

## 🧪 Testing Features
- **Add/Edit Devices:** Try adding, editing, and importing/exporting devices.
- **Results:** Check energy, CO₂, cost, and renewable offset calculations.
- **What-if:** Use the What-if panel to simulate changes.
- **Lifecycle:** See manufacturing/disposal CO₂.
- **Benchmarks:** Compare to national/global averages.
- **Charts:** View breakdowns and trends.
- **History:** Save results and view the history table and trend chart.
- **Live Emission Factors:** Change region and see if the CO₂ factor updates (may require a real API key for some regions).
- **Responsive:** Resize your browser or use mobile view.
- **Language/Theme:** Try switching language and dark/light mode in the top bar.

---

## 🛠️ Troubleshooting
- **Node version errors:** Use Node v18 or v20 (not v22+). Use [nvm-windows](https://github.com/coreybutler/nvm-windows) to switch versions.
- **Dependency errors:** Run `npm install --legacy-peer-deps`.
- **Live CO₂ API limits:** For full access, get a free API key at [CO2 Signal](https://www.co2signal.com/).
- **App won't start?** Check terminal for errors and ensure you're in the `sustainability-footprint` directory.

---

## 🤝 Contributing
1. Fork this repo and clone your fork.
2. Create a new branch for your feature or fix.
3. Commit your changes and push.
4. Open a Pull Request with a clear description.

All contributions, bug reports, and feature requests are welcome!

---

## 🙏 Acknowledgments
- [React](https://react.dev/), [Material UI](https://mui.com/), [Recharts](https://recharts.org/), [jsPDF](https://github.com/parallax/jsPDF), [i18next](https://www.i18next.com/), [CO2 Signal](https://www.co2signal.com/), [electricityMap](https://www.electricitymap.org/), and the open data community.

---

_This project is built for a sustainable future. 🌱_
