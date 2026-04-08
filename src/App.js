import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlanMyHome from './pages/PlanMyHome';
import Suggestions from './pages/Suggestions';
import DecorIdeas from './pages/DecorIdeas';
import WasteToDecor from './pages/WasteToDecor';
import BudgetPlanner from './pages/BudgetPlanner';
import VastuGuide from './pages/VastuGuide';
import SavedDesigns from './pages/SavedDesigns';
import PhotoAnalyze from './pages/PhotoAnalyze';
import ProgressTracker from './pages/ProgressTracker';
import Wallcolor from './pages/Wallcolor';
import FloorPlan from './pages/FloorPlan';
import CommunityFeed from './pages/CommunityFeed';
import Badges from './pages/Badges';
import BeforeAfter from './pages/BeforeAfter';
import GardenPlanner from './pages/GardenPlanner';
import SeasonalGuide from './pages/SeasonalGuide';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/plan" element={<PlanMyHome />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/decor" element={<DecorIdeas />} />
        <Route path="/waste" element={<WasteToDecor />} />
        <Route path="/budget" element={<BudgetPlanner />} />
        <Route path="/vastu" element={<VastuGuide />} />
        <Route path="/saved" element={<SavedDesigns />} />
        <Route path="/photo" element={<PhotoAnalyze />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/wallcolor" element={<Wallcolor />} />
        <Route path="/floorplan" element={<FloorPlan />} />
        <Route path="/community" element={<CommunityFeed />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/beforeafter" element={<BeforeAfter />} />
        <Route path="/garden" element={<GardenPlanner />} />
        <Route path="/seasonal" element={<SeasonalGuide />} />
      </Routes>
    </Router>
  );
}

export default App;
