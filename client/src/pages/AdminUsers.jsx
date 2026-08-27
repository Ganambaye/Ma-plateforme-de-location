import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import api from '../services/api';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', role: 'etudiant', etablissement: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filtreRole, setFiltreRole] = useState('tous');
  const [usersFiltres, setUsersFiltres] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (filtreRole === 'tous') {
      setUsersFiltres(users);
    } else {
      setUsersFiltres(users.filter((u) => u.role === filtreRole));
    }
  }, [filtreRole, users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await adminService.createUser(form);
      setMessage('Utilisateur créé avec succès');
      setForm({ nom: '', prenom: '', email: '', telephone: '', password: '', role: 'etudiant', etablissement: '' });
      setShowAddForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-light flex items-center justify-center'>
        <div className='text-center'>
          <svg className="animate-spin h-12 w-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className='text-gray-500'>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      bailleur: 'bg-green-100 text-green-800',
      etudiant: 'bg-blue-100 text-blue-800',
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className='min-h-screen bg-light'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Gestion des utilisateurs</h1>
            <p className='text-gray-600 mt-1'>Gérez les comptes étudiants, bailleurs et administrateurs</p>
          </div>
          <div className='flex gap-3'>
            <select value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)} className='input-field w-auto'>
              <option value='tous'>Tous les rôles</option>
              <option value='etudiant'>Étudiants</option>
              <option value='bailleur'>Bailleurs</option>
              <option value='admin'>Administrateurs</option>
            </select>
            <button onClick={() => setShowAddForm(!showAddForm)} className='btn-primary inline-flex items-center gap-2'>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {showAddForm ? 'Annuler' : 'Ajouter un utilisateur'}
            </button>
          </div>
        </div>

        {message && (
          <div className='bg-green-50 text-green-600 p-4 rounded-xl mb-6 flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        {error && (
          <div className='bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-2'>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {showAddForm && (
          <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100'>
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Ajouter un utilisateur</h2>
            <form onSubmit={handleCreateUser} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Nom</label>
                <input type='text' name='nom' value={form.nom} onChange={handleChange} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Prénom</label>
                <input type='text' name='prenom' value={form.prenom} onChange={handleChange} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Email</label>
                <input type='email' name='email' value={form.email} onChange={handleChange} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Téléphone</label>
                <input type='tel' name='telephone' value={form.telephone} onChange={handleChange} className='input-field' required />
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Mot de passe</label>
                <div className='input-group'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    className='input-field'
                    required
                    minLength={6}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='password-toggle'
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3.293-3.293m0 0a3 3 0 104.243-4.243l3.293 3.293m-3.293-3.293l3.293 3.293M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Rôle</label>
                <select name='role' value={form.role} onChange={handleChange} className='input-field'>
                  <option value='etudiant'>Étudiant</option>
                  <option value='bailleur'>Bailleur</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
              <div className='md:col-span-2'>
                <label className='block text-gray-700 text-sm font-medium mb-2'>Établissement (optionnel)</label>
                <input type='text' name='etablissement' value={form.etablissement} onChange={handleChange} className='input-field' />
              </div>
              <div className='md:col-span-2'>
                <button type='submit' className='btn-primary'>Créer l'utilisateur</button>
              </div>
            </form>
          </div>
        )}

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-100'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Nom</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Téléphone</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Rôle</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='px-6 py-8 text-center text-gray-500'>
                      {usersFiltres.length === 0 && users.length > 0 ? 'Aucun utilisateur ne correspond au filtre' : 'Aucun utilisateur pour le moment'}
                    </td>
                  </tr>
                ) : usersFiltres.map((u) => (
                  <tr key={u._id} className='hover:bg-gray-50 transition'>
                    <td className='px-6 py-4 text-sm font-medium text-gray-800'>{u.prenom} {u.nom}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{u.email}</td>
                    <td className='px-6 py-4 text-sm text-gray-600'>{u.telephone}</td>
                    <td className='px-6 py-4'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className='text-red-600 hover:text-red-700 text-sm font-medium hover:underline inline-flex items-center gap-1'
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
