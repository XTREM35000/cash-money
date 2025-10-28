import React, { useState } from 'react';
import { Client } from '@/types';
import ClientsList from '@/components/clients/ClientsList';
import ClientModal from '@/components/clients/ClientModal';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Client[];
    }
  });

  const handleNewClient = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <Button onClick={handleNewClient}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <ClientsList
          items={clients || []}
          onEdit={handleEditClient}
        />
      )}

      <ClientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        client={selectedClient}
        onSaved={() => {
          setIsModalOpen(false);
          setSelectedClient(null);
        }}
      />
    </div>
  );
}