import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { PencilIcon, MessageSquare } from 'lucide-react';

interface ClientsListProps {
  items: Client[];
  onEdit?: (client: Client) => void;
}

const ClientsList = ({ items, onEdit }: ClientsListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Type d'ID</TableHead>
            <TableHead>Numéro d'ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((client) => (
            <TableRow key={client.id}>
              <TableCell>{client.first_name}</TableCell>
              <TableCell>{client.last_name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.phone}</TableCell>
              <TableCell>
                {client.id_type === 'passport' && 'Passeport'}
                {client.id_type === 'id_card' && 'Carte d\'identité'}
                {client.id_type === 'driver_license' && 'Permis de conduire'}
                {client.id_type === 'other' && 'Autre'}
              </TableCell>
              <TableCell>{client.id_number}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(client)}
                  className="h-8 w-8"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>

                {/* WhatsApp quick action when phone exists */}
                {client.phone && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      // Normalize phone to digits and remove leading +
                      const digits = (client.phone || '').replace(/\D/g, '');
                      const normalized = digits.replace(/^0+/, '');
                      const url = `https://wa.me/${normalized}`;
                      window.open(url, '_blank');
                    }}
                    className="h-8 w-8"
                    title={`Contacter ${client.first_name}`}
                  >
                    <MessageSquare className="h-4 w-4 text-green-600" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
