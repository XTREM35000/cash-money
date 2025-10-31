import PageWrapper from '@/components/PageWrapper';
import React, { useState } from 'react';
import { Client } from '@/types';
import ClientsList from '@/components/clients/ClientsList';
import ClientModal from '@/components/clients/ClientModal';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Card } from '@/components/ui/card';

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
    <PageWrapper maxWidth="6xl">
        <div className="p-4 bg-white/5 border-b">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <AnimatedLogo size={40} />
            <div>
              <h2 className="text-lg font-medium">Clients</h2>
              <p className="text-sm text-muted-foreground">Gérer vos clients</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
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
            <Card className="p-4">
              <ClientsList
                items={clients || []}
                onEdit={handleEditClient}
              />
            </Card>
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
    </PageWrapper>
  );
}