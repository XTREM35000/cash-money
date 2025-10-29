import React, { useEffect, useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DraggableModalWrapper } from '@/components/ui/draggable-modal-wrapper';
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Client, CreateClient } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
  client?: Client | null;
}

const ClientModal = ({ open, onOpenChange, onSaved, client }: Props) => {
  const [firstName, setFirstName] = useState(client?.first_name ?? '');
  const [lastName, setLastName] = useState(client?.last_name ?? '');
  const [email, setEmail] = useState(client?.email ?? '');
  const [phone, setPhone] = useState(client?.phone ?? '');
  const [address, setAddress] = useState(client?.address ?? '');
  const [idNumber, setIdNumber] = useState(client?.id_number ?? '');
  const [idType, setIdType] = useState(client?.id_type ?? '');
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) {
      setFirstName(client?.first_name ?? '');
      setLastName(client?.last_name ?? '');
      setEmail(client?.email ?? '');
      setPhone(client?.phone ?? '');
      setAddress(client?.address ?? '');
      setIdNumber(client?.id_number ?? '');
      setIdType(client?.id_type ?? '');
    }
  }, [open, client]);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      if (email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) {
        throw new Error('Email invalide');
      }

      const payload: CreateClient = {
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        address: address || null,
        id_number: idNumber || null,
        id_type: idType || null
      };

      if (client?.id) {
        await supabase.from('clients').update(payload).eq('id', client.id);
      } else {
        await supabase.from('clients').insert(payload);
      }

      qc.invalidateQueries({ queryKey: ['clients'] });
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du client', err);
    } finally {
      setLoading(false);
    }
  };

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    if (!client?.id) return;
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!client?.id) return;
    setLoading(true);
    try {
      await supabase.from('clients').delete().eq('id', client.id);
      qc.invalidateQueries({ queryKey: ['clients'] });
      onSaved?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Erreur lors de la suppression du client', err);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <DraggableModalWrapper isOpen={open} onClose={() => onOpenChange(false)} className="max-w-2xl">
        <div>
          <DialogHeader>
            <DialogTitle>{client ? 'Modifier Client' : 'Nouveau Client'}</DialogTitle>
          </DialogHeader>

          <Card className="p-4">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom du client"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom du client"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <EmailInput value={email ?? ''} onChange={(v) => setEmail(v)} />
              </div>

              <div className="space-y-2">
                <PhoneInput value={phone ?? ''} onChange={(v) => setPhone(v)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adresse</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type d'identification</label>
                  <Select value={idType} onValueChange={setIdType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="passport">Passeport</SelectItem>
                      <SelectItem value="id_card">Carte d'identité</SelectItem>
                      <SelectItem value="driver_license">Permis de conduire</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Numéro d'identification</label>
                  <Input
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Numéro du document"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {client && (
                  <Button
                    variant="ghost"
                    type="button"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={loading}
                  >
                    Supprimer
                  </Button>
                )}
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => onOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </DraggableModalWrapper>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le client {client?.first_name} {client?.last_name}</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Voulez-vous continuer ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirmer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientModal;
