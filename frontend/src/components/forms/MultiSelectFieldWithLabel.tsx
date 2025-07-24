import React, { useState, useRef } from 'react';
import { useField, useFormikContext } from 'formik';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Option = {
  value: string;
  label: string;
};

type MultiSelectFieldWithLabelProps = {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  description?: string;
  maxItems?: number;
  allowCreation?: boolean;
  creationLabel?: string;
} & (
    | { formik: true }
    | {
      formik?: false;
      value: string[];
      onChange: (value: string[]) => void;
      onBlur?: () => void;
      errors?: Record<string, { message: string }> | undefined;
    }
  );

const MultiSelectFieldWithLabel: React.FC<MultiSelectFieldWithLabelProps> = (props) => {
  const {
    label,
    name,
    options,
    placeholder = 'Select options...',
    className = '',
    disabled = false,
    required = false,
    description,
    maxItems,
    allowCreation = false,
    creationLabel = 'Add: ',
  } = props;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const commandRef = useRef<HTMLDivElement>(null);

  // Handle both Formik and non-Formik usage
  const formik = useFormikContext();

  if (formik) {
    // Formik version
    const [field, meta, helpers] = useField(name);
    const selectedValues = field.value as string[] || [];
    const hasError = meta.touched && meta.error;

    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCreateOption();
      }
    });

    const handleSelect = (value: string) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];

      // Check if we're over the max items limit
      if (maxItems && !selectedValues.includes(value) && selectedValues.length >= maxItems) {
        return;
      }

      helpers.setValue(newValues);
      helpers.setTouched(true);

      if (allowCreation && value === search && !options.find(o => o.value === search)) {
        setSearch('');
      }
    };

    const handleRemove = (value: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const newValues = selectedValues.filter(v => v !== value);
      helpers.setValue(newValues);
      helpers.setTouched(true);
    };

    const handleCreateOption = () => {
      if (!search || selectedValues.includes(search) || options.find(o => o.value === search)) {
        return;
      }

      // Check if we're over the max items limit
      if (maxItems && selectedValues.length >= maxItems) {
        return;
      }

      helpers.setValue([...selectedValues, search]);
      helpers.setTouched(true);
      setSearch('');
      setOpen(false);
    };

    // Filter options based on search
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );

    // Check if current search could be a new option
    const canCreateOption =
      allowCreation &&
      search &&
      !options.find(option =>
        option.value === search ||
        option.label.toLowerCase() === search.toLowerCase()
      );

    return (
      <div className={`mb-4 ${className}`}>
        <Label htmlFor={name} className="block text-sm font-medium mb-1 text-muted-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full justify-between h-auto min-h-10 ${hasError ? 'border-jb-danger' : ''
                }`}
              disabled={disabled}
              onClick={() => setOpen(!open)}
            >
              <div className="flex flex-wrap gap-1 py-1">
                {selectedValues.length > 0 ? (
                  selectedValues.map(value => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="mr-1 mb-1"
                    >
                      {options.find(option => option.value === value)?.label || value}
                      <span
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onMouseDown={e => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={e => handleRemove(value, e)}
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command ref={commandRef} className="w-full">
              <CommandInput
                placeholder="Search options..."
                value={search}
                onValueChange={setSearch}
                className="h-9"
              />
              <CommandEmpty>
                {allowCreation ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={handleCreateOption}
                  >
                    {creationLabel} "{search}"
                  </Button>
                ) : (
                  "No options found"
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
                {canCreateOption && (
                  <CommandItem
                    value={search}
                    onSelect={handleCreateOption}
                    className="text-blue-600"
                  >
                    {creationLabel} "{search}"
                  </CommandItem>
                )}
              </CommandGroup>
              {maxItems && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
                  {selectedValues.length} / {maxItems} selected
                </div>
              )}
            </Command>
          </PopoverContent>
        </Popover>

        {hasError && (
          <p className="mt-1 text-sm text-red-600">{meta.error}</p>
        )}
      </div>
    );
  } else {
    // Fallback for when formik context is missing
    console.warn(`MultiSelectField with name "${name}" is marked as a Formik field but no Formik context was found.`);
    return (
      <div className={`mb-4 ${className}`}>
        <Label htmlFor={name} className="block text-sm font-medium mb-1 text-muted-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        {description && (
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
        )}

        <Button
          variant="outline"
          className="w-full justify-between h-auto min-h-10"
          disabled={true}
        >
          <span className="text-muted-foreground">{placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
    );
  }
  
};

export default MultiSelectFieldWithLabel;