'use client';

import PrivateRoute from '@/components/auth/PrivateRoute';
import { PetForm } from '@/components/pets/PetForm';
import { PetList } from '@/components/pets/PetList';
import { WalkRequestForm } from '@/components/walks/WalkRequestForm';
import { WalkRequestList } from '@/components/walks/WalkRequestList';
import { useState } from 'react';

export default function PropietarioPage() {
  // Estos estados se utilizan para forzar la actualización de las listas cuando se agrega un nuevo elemento.
  const [petListKey, setPetListKey] = useState(0);
  const [walkRequestListKey, setWalkRequestListKey] = useState(0);

  const handlePetAdded = () => {
    setPetListKey(prevKey => prevKey + 1);
  };

  const handleWalkRequested = () => {
    setWalkRequestListKey(prevKey => prevKey + 1);
  };

  return (
    <PrivateRoute roles={['propietario', 'admin']}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Agregar Nueva Mascota</h2>
              <PetForm onPetAdded={handlePetAdded} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Solicitar un Paseo</h2>
              <WalkRequestForm onWalkRequested={handleWalkRequested} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Mis Mascotas</h2>
              <PetList key={petListKey} />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Mis Solicitudes de Paseo</h2>
              <WalkRequestList key={walkRequestListKey} />
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
