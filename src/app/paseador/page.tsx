'use client';

import PrivateRoute from '@/components/auth/PrivateRoute';
import { AvailableWalks } from '@/components/walks/AvailableWalks';
import { MyWalks } from '@/components/walks/MyWalks';

export default function PaseadorPage() {
  return (
    <PrivateRoute roles={['paseador', 'admin']}>
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Paseos Disponibles</h2>
            <AvailableWalks />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Mis Paseos</h2>
            <MyWalks />
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
