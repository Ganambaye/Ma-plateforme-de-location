function Confidentialite() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <section className='bg-dark text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>Politique de Confidentialité</h1>
          <p className='text-xl text-gray-300'>Dernière mise à jour : 11 août 2026</p>
        </div>
      </section>

      <section className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-8'>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>1. Collecte des données</h2>
            <p className='text-gray-600 leading-relaxed'>Nous collectons les données suivantes : nom, prénom, email, numéro de téléphone, type de profil (étudiant/bailleur), préférences de logement et, pour les étudiants, une photo de CNI et des informations sur vos habitudes de vie afin d'améliorer le matching avec les propriétaires.</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>2. Utilisation des données</h2>
            <p className='text-gray-600 leading-relaxed'>Vos données sont utilisées pour : créer et gérer votre compte, vous proposer des logements adaptés, faciliter la mise en relation avec les propriétaires, améliorer nos services, et vous envoyer des notifications relatives à vos demandes.</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>3. Stockage et sécurité</h2>
            <p className='text-gray-600 leading-relaxed'>Vos données sont stockées sur des serveurs sécurisés. Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos informations contre tout accès non autorisé, modification ou divulgation.</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>4. Partage des données</h2>
            <p className='text-gray-600 leading-relaxed'>Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec les propriétaires concernés par une demande de visite ou avec nos prestataires techniques strictement nécessaires au fonctionnement de la plateforme.</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>5. Droits des utilisateurs</h2>
            <p className='text-gray-600 leading-relaxed'>Conformément à la loi sénégalaise, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez exercer ces droits à tout moment en nous contactant à l'adresse contact@tanal-sa-logement.sn.</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>6. Cookies</h2>
            <p className='text-gray-600 leading-relaxed'>Nous utilisons des cookies essentiels au fonctionnement du site et des cookies d'analyse pour améliorer l'expérience utilisateur. Vous pouvez désactiver les cookies non essentiels dans les paramètres de votre navigateur.</p>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-gray-800 mb-3'>7. Conservation des données</h2>
            <p className='text-gray-600 leading-relaxed'>Vos données sont conservées aussi longtemps que votre compte est actif. Après suppression de votre compte, vos données sont anonymisées ou supprimées dans un délai de 30 jours, sauf obligation légale de conservation.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Confidentialite;

