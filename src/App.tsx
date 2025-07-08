import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SellCarPage from './pages/SellCarPage';
import DashboardPage from './pages/DashboardPage';
import SubscriptionPage from './pages/SubscriptionPage';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="listing/:id" element={<ListingDetailPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="sell" element={<SellCarPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
          </Route>
        </Routes>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;