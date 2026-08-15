import { Routes, Route } from 'react-router'
import { ToastContainer } from './core/providers/toast-container'
import { MainLayout } from './core/layout/main-layout'
import { LandingPage } from './core/router/pages/landing-page'
import { NotFoundPage } from './core/router/pages/not-found-page'
import { LoginPage } from './features/auth/presentation/pages/login-page'
import { RegisterPage } from './features/auth/presentation/pages/register-page'
import { HomePage } from './features/home/presentation/pages/home-page'
import { SearchPage } from './features/search/presentation/pages/search-page'
import { ArtistProfilePage } from './features/catalog-artist-profile/presentation/pages/artist-profile-page'
import { AlbumDetailPage } from './features/catalog-album-detail/presentation/pages/album-detail-page'
import { PlaylistDetailPage } from './features/playlists/presentation/pages/playlist-detail-page'
import { MyPlaylistsPage } from './features/playlists/presentation/pages/my-playlists-page'
import { LibraryPage } from './features/library/presentation/pages/library-page'
import { QueuePage } from './features/player/presentation/pages/queue-page'
import { ProfilePage } from './features/profile/presentation/pages/profile-page'
import { SettingsPage } from './features/settings/presentation/pages/settings-page'
import { ListeningHistoryPage } from './features/listening-history/presentation/pages/listening-history-page'
import { UploadPage } from './features/upload/presentation/pages/upload-page'
import { AdminDashboardPage } from './features/admin/presentation/pages/admin-dashboard-page'
import { AdminUsersPage } from './features/admin/presentation/pages/admin-users-page'
import { AdminModerationPage } from './features/admin/presentation/pages/admin-moderation-page'
import { PremiumPage } from './features/premium/presentation/pages/premium-page'
import {PreferencesPage} from "./features/settings/presentation/pages/preferences-page.tsx";
import {PasswordPage} from "./features/settings/presentation/pages/password-page.tsx";


function App() {
  return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<MainLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/artists/:artistId" element={<ArtistProfilePage />} />
            <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
            <Route path="/playlists" element={<MyPlaylistsPage />} />
            <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/settings/preferences" element={<PreferencesPage />} />
            <Route path="/settings/password" element={<PasswordPage />} />

            <Route path="/history" element={<ListeningHistoryPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/moderation" element={<AdminModerationPage />} />
            <Route path="/premium" element={<PremiumPage />} />
          </Route>



          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <ToastContainer />
      </>
  )
}

export default App