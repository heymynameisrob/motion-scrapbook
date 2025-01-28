import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/primitives/button";
import {
  Form as FormBase,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/primitives/form";
import { cn, waitFor } from "@/lib/utils";
import { Spinner } from "@/primitives/spinner";
import { Input } from "@/primitives/input";
import { useAnimationSpeed } from "@/components/motion-provider";

const formSchema = z.object({
  email: z.string().email(),
});

export function Form() {
  const [state, setState] = React.useState<
    "default" | "submitting" | "success"
  >("default");
  const { speed } = useAnimationSpeed();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const content = React.useMemo(() => {
    switch (state) {
      case "submitting":
        return <Spinner className="w-5 h-5" />;
      case "success":
        return "Login link sent!";
      default:
        return "Send me a login link";
    }
  }, [state]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setState("submitting");
    // Simulates API request
    waitFor(2000 * (1 / speed)).then(() => {
      setState("success");
    });
    console.log(values);
  }

  return (
    <FormBase {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-[360px] space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email"
                  {...field}
                  className="h-11"
                  autoFocus
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="md"
          disabled={state !== "default"}
          className={cn(
            "w-full overflow-hidden",
            state === "success"
              ? "bg-green-700 dark:bg-green-700 disabled:opacity-100 text-white"
              : null,
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              initial={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              key={state}
              className="drop-shadow-sm"
            >
              {content}
            </motion.span>
          </AnimatePresence>
        </Button>
        <FormMessage
          className={cn(
            "!text-xs !text-secondary text-center opacity-0",
            state === "success" && "opacity-100",
          )}
        >
          Give it 2 minutes. If no link arrives, then try again
        </FormMessage>
      </form>
    </FormBase>
  );
}
