import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export default function SectionHeading({ eyebrow, title, subtitle }: Props) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
