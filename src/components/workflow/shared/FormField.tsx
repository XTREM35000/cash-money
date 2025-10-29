import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EmailInput } from '@/components/ui/email-input';
import { PasswordInput } from '@/components/ui/password-input';
import { PhoneInput } from '@/components/ui/phone-input';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  children?: ReactNode;
}

export const FormField = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  children
}: FormFieldProps) => {
  // Render specialized inputs when possible to keep consistent behavior across the app
  const renderField = () => {
    if (children) return children;

    if (type === 'email') {
      return (
        <EmailInput
          value={value}
          onChange={(v) => onChange(v)}
          label={label}
          required={required}
          className="rounded-lg"
        />
      );
    }

    if (type === 'password') {
      return (
        <PasswordInput
          value={value}
          onChange={(v) => onChange(v)}
          label={label}
          required={required}
          className="rounded-lg"
        />
      );
    }

    // Telephone can be declared with type='tel' or label includes 'Téléphone'
    if (type === 'tel' || /téléphone/i.test(label)) {
      return (
        <PhoneInput
          value={value}
          onChange={(v) => onChange(v)}
          label={label}
          required={required}
          className="rounded-lg"
        />
      );
    }

    return (
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="rounded-lg"
      />
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}{required && ' *'}</Label>
      {renderField()}
    </div>
  );
};
