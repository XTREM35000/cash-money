import React, { useState, useEffect } from "react";
import { FormModal } from '@/components/ui/FormModal';
import AnimatedLogo from "@/components/AnimatedLogo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmailInput } from '@/components/ui/email-input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: "client" | "supplier" | string;
  initialName?: string;
  existing?: any;
  onCreated?: (profile: any) => void;
}

const CreateProfileModal = ({
  open,
  onOpenChange,
  role = "client",
  initialName = "",
  existing,
  onCreated,
}: Props) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) {
      setName(initialName);
      setEmail("");
      setPhone("");
    }
  }, [open, initialName]);

  useEffect(() => {
    if (open && existing) {
      setName(existing.full_name ?? "");
      setEmail(existing.email ?? "");
      setPhone(existing.phone_number ?? "");
    }
  }, [open, existing]);

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!name) return;

    setLoading(true);

    try {
      if (email && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(email)) {
        throw new Error("Email invalide");
      }

      const payload = {
        full_name: name,
        email: email || null,
        phone_number: phone || null,
      };

      let data: any = null;

      if (existing?.id) {
        const updateRes = await supabase
          .from("clients")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();

        if (updateRes.error) throw updateRes.error;
        data = updateRes.data;

        toast({ title: "Client mis à jour ✅" });
      } else {
        const insertRes = await supabase
          .from("clients")
          .insert(payload)
          .select()
          .single();

        if (insertRes.error) throw insertRes.error;
        data = insertRes.data;

        toast({ title: "Client créé ✅" });
      }

      qc.invalidateQueries({ queryKey: ["clients"] });
      onCreated?.(data);
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erreur ❌",
        description: err.message || "Une erreur s'est produite",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      draggable
      className="sm:max-w-md"
      title={existing ? "Modifier le Client" : `Créer ${role === "supplier" ? "Fournisseur" : "Client"}`}>
      <Card className="p-4">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom complet</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <EmailInput value={email} onChange={(v) => setEmail(v)} className="w-full" />
          </div>

          <div>
            <PhoneInput value={phone} onChange={(v) => setPhone(v)} className="w-full" />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Chargement..."
                : existing
                  ? "Enregistrer"
                  : "Créer"}
            </Button>
          </div>
        </form>
      </Card>
    </FormModal>
  );
};

export default CreateProfileModal;
