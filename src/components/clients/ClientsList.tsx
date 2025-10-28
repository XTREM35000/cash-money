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
import { PencilIcon } from 'lucide-react';

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
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit?.(client)}
                  className="h-8 w-8"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
