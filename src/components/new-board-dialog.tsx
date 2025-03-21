import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

const formSchema = z.object({
  boardName: z
    .string()
    .trim()
    .min(1, 'Board name is required')
    .max(255, 'Board name is too long')
    .refine(
      (name) =>
        /^[^<>:"/\\|?*]+\.md$/.test(name) || /^[^<>:"/\\|?*]+$/.test(name),
      {
        message: 'Invalid filename. Cannot contain: < > : " / \\ | ? *',
      }
    ),
});

type NewBoardDialogProps = {
  onNewBoard: (name: string) => void;
};

export function NewBoardDialog({ onNewBoard }: NewBoardDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boardName: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const fileName = values.boardName.endsWith('.md')
      ? values.boardName
      : `${values.boardName}.md`;

    setOpen(false);
    onNewBoard(fileName);
    setTimeout(() => {
      form.reset();
    }, 200);
  }

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='secondary' className='size-7 hover:bg-background/40'>
          <PlusIcon className='w-4 h-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='p-2'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-0'>
            <FormField
              control={form.control}
              name='boardName'
              render={({ field }) => (
                <FormItem className='gap-0 pr-4'>
                  <FormMessage className='text-xs pl-1' />
                  <FormControl>
                    <Input
                      className='ring-0 focus-visible:ring-0 border-0 shadow-none'
                      placeholder='Give your board a name...'
                      {...field}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='submit'
                size={'sm'}
                className='text-xs'
                variant={'outline'}
              >
                Create board
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
