import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ResearchPage from './pages/ResearchPage'
import ToolsPage from './pages/ToolsPage'
import PlainSpeakTool from './tools/PlainSpeak'
import LegislationPage from './pages/LegislationPage'
import EducationPage from './pages/EducationPage'
import CoalitionPage from './pages/CoalitionPage'
import PostLaborPage from './pages/PostLaborPage'
// New integrated tools and pages
import ProcessMapPage from './pages/ProcessMapPage'
import PlainSpeakPage from './pages/PlainSpeakPage'
import PilotKitPage from './pages/PilotKitPage'
import CoalitionLaunchPage from './pages/CoalitionLaunchPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="tools" element={<ToolsPage />} />
        <Route path="tools/plainspeak" element={<PlainSpeakTool />} />
        <Route path="tools/plainspeak-ai" element={<PlainSpeakPage />} />
        <Route path="tools/processmap" element={<ProcessMapPage />} />
        <Route path="tools/processmap/:processId" element={<ProcessMapPage />} />
        <Route path="legislation" element={<LegislationPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="coalition" element={<CoalitionPage />} />
        <Route path="coalition/launch" element={<CoalitionLaunchPage />} />
        <Route path="pilot" element={<PilotKitPage />} />
        <Route path="post-labor" element={<PostLaborPage />} />
      </Route>
    </Routes>
  )
}

export default App
