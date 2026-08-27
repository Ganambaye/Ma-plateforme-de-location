import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AnnonceList from "./pages/AnnonceList";
import AnnonceDetail from "./pages/AnnonceDetail";
import Colocation from "./pages/Colocation";
import AdminDashboard from "./pages/AdminDashboard";
import PendingAnnonces from "./pages/PendingAnnonces";
import AdminAddAnnonce from "./pages/AdminAddAnnonce";
import AdminEditAnnonce from "./pages/AdminEditAnnonce";
import AdminVisites from "./pages/AdminVisites";
import AdminUsers from "./pages/AdminUsers";
import AdminFinances from "./pages/AdminFinances";
import AdminBotWhatsApp from "./pages/AdminBotWhatsApp";
import AdminAvis from "./pages/AdminAvis";
import AdminNotifications from "./pages/AdminNotifications";
import AdminModeration from "./pages/AdminModeration";
import AdminQuartiers from "./pages/AdminQuartiers";
import AdminPrix from "./pages/AdminPrix";
import MesVisites from "./pages/MesVisites";
import MesPaiements from "./pages/MesPaiements";
import WhatsAppOTP from "./pages/WhatsAppOTP";
import DashboardEtudiant from "./pages/DashboardEtudiant";
import DashboardBailleur from "./pages/DashboardBailleur";
import AjouterLogement from "./pages/AjouterLogement";
import MesBiens from "./pages/MesBiens";
import MesDossiers from "./pages/MesDossiers";
import ProfilColocataire from "./pages/ProfilColocataire";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PayerPublication from "./pages/PayerPublication";
import PremiumEtudiant from "./pages/PremiumEtudiant";
import AssistantIA from "./pages/AssistantIA";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'bailleur') return <Navigate to='/dashboard/bailleur' replace />;
  return <Navigate to='/dashboard/etudiant' replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/annonces" element={<AnnonceList />} />
            <Route path="/annonces/:id" element={<AnnonceDetail />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/colocation" element={<Colocation />} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/annonces/en-attente" element={<ProtectedRoute adminOnly><PendingAnnonces /></ProtectedRoute>} />
            <Route path="/admin/annonces/ajouter" element={<ProtectedRoute adminOnly><AdminAddAnnonce /></ProtectedRoute>} />
            <Route path="/admin/annonces/modifier/:id" element={<ProtectedRoute adminOnly><AdminEditAnnonce /></ProtectedRoute>} />
            <Route path="/admin/visites" element={<ProtectedRoute adminOnly><AdminVisites /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/finances" element={<ProtectedRoute adminOnly><AdminFinances /></ProtectedRoute>} />
            <Route path="/admin/bot-whatsapp" element={<ProtectedRoute adminOnly><AdminBotWhatsApp /></ProtectedRoute>} />
            <Route path="/admin/avis" element={<ProtectedRoute adminOnly><AdminAvis /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute adminOnly><AdminNotifications /></ProtectedRoute>} />
            <Route path="/admin/moderation" element={<ProtectedRoute adminOnly><AdminModeration /></ProtectedRoute>} />
            <Route path="/admin/quartiers" element={<ProtectedRoute adminOnly><AdminQuartiers /></ProtectedRoute>} />
            <Route path="/admin/prix" element={<ProtectedRoute adminOnly><AdminPrix /></ProtectedRoute>} />
            <Route path="/mes-visites" element={<ProtectedRoute><MesVisites /></ProtectedRoute>} />
            <Route path="/mes-paiements" element={<ProtectedRoute><MesPaiements /></ProtectedRoute>} />
            <Route path="/mes-dossiers" element={<ProtectedRoute><MesDossiers /></ProtectedRoute>} />
            <Route path="/colocation/profil" element={<ProtectedRoute><ProfilColocataire /></ProtectedRoute>} />
            <Route path="/bailleur/ajouter-logement" element={<ProtectedRoute bailleurOnly><AjouterLogement /></ProtectedRoute>} />
            <Route path="/bailleur/mes-biens" element={<ProtectedRoute bailleurOnly><MesBiens /></ProtectedRoute>} />
            <Route path="/bailleur/booster/:id" element={<ProtectedRoute bailleurOnly><PayerPublication /></ProtectedRoute>} />
             <Route path="/premium/etudiant" element={<ProtectedRoute etudiantOnly><PremiumEtudiant /></ProtectedRoute>} />
             <Route path="/assistant-ia" element={<AssistantIA />} />
             <Route path="/tableau-de-bord" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
             <Route path="/dashboard/etudiant" element={<ProtectedRoute etudiantOnly><DashboardEtudiant /></ProtectedRoute>} />
             <Route path="/dashboard/bailleur" element={<ProtectedRoute bailleurOnly><DashboardBailleur /></ProtectedRoute>} />
             <Route path="/connexion-whatsapp" element={<WhatsAppOTP />} />
             <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;