import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode
} from 'react';
import { cx } from '../lib/cx';
import styles from './mobile-shell.module.css';

type Tone = 'neutral' | 'peach' | 'mint' | 'sky' | 'lavender';
type Gap = 'sm' | 'md' | 'lg';
type HTMLAttributesWithoutTitle<T> = Omit<HTMLAttributes<T>, 'title'>;

const toneClassNames: Record<Tone, string> = {
  neutral: styles.screenToneNeutral,
  peach: styles.screenTonePeach,
  mint: styles.screenToneMint,
  sky: styles.screenToneSky,
  lavender: styles.screenToneLavender
};

const heroToneClassNames: Record<Tone, string> = {
  neutral: styles.heroToneNeutral,
  peach: styles.heroTonePeach,
  mint: styles.heroToneMint,
  sky: styles.heroToneSky,
  lavender: styles.heroToneLavender
};

const bubbleToneClassNames: Record<Tone, string> = {
  neutral: styles.bubbleToneNeutral,
  peach: styles.bubbleTonePeach,
  mint: styles.bubbleToneMint,
  sky: styles.bubbleToneSky,
  lavender: styles.bubbleToneLavender
};

const actionToneClassNames: Record<Tone, string> = {
  neutral: styles.actionToneNeutral,
  peach: styles.actionTonePeach,
  mint: styles.actionToneMint,
  sky: styles.actionToneSky,
  lavender: styles.actionToneLavender
};

const gapClassNames: Record<Gap, string> = {
  sm: styles.gapSm,
  md: styles.gapMd,
  lg: styles.gapLg
};

type BubbleAlign = 'start' | 'center' | 'end';
type BubblePointer = 'none' | 'bottom' | 'left' | 'right';
type BubbleSize = 'sm' | 'md' | 'lg' | 'full';
type HeaderAlign = 'start' | 'center';
type DockLayout = 'single' | 'split' | 'triple';

const bubbleAlignClassNames: Record<BubbleAlign, string> = {
  start: styles.bubbleAlignStart,
  center: styles.bubbleAlignCenter,
  end: styles.bubbleAlignEnd
};

const bubblePointerClassNames: Record<Exclude<BubblePointer, 'none'>, string> = {
  bottom: styles.bubblePointerBottom,
  left: styles.bubblePointerLeft,
  right: styles.bubblePointerRight
};

const bubbleSizeClassNames: Record<BubbleSize, string> = {
  sm: styles.bubbleSizeSm,
  md: styles.bubbleSizeMd,
  lg: styles.bubbleSizeLg,
  full: styles.bubbleSizeFull
};

const dockLayoutClassNames: Record<DockLayout, string> = {
  single: styles.dockSingle,
  split: styles.dockSplit,
  triple: styles.dockTriple
};

export interface SafeAreaFrameProps extends HTMLAttributes<HTMLDivElement> {
  bleed?: boolean;
  compact?: boolean;
  notch?: boolean;
}

export function SafeAreaFrame({
  bleed = false,
  children,
  className,
  compact = false,
  notch = false,
  ...props
}: SafeAreaFrameProps) {
  return (
    <div
      className={cx(
        styles.frame,
        compact && styles.frameCompact,
        bleed && styles.frameBleed,
        className
      )}
      {...props}
    >
      {notch ? <div className={styles.notch} aria-hidden="true" /> : null}
      {children}
    </div>
  );
}

export interface ScreenContainerProps extends HTMLAttributes<HTMLElement> {
  bodyClassName?: string;
  footer?: ReactNode;
  gap?: Gap;
  header?: ReactNode;
  padded?: boolean;
  tone?: Tone;
}

export function ScreenContainer({
  bodyClassName,
  children,
  className,
  footer,
  gap = 'md',
  header,
  padded = true,
  tone = 'neutral',
  ...props
}: ScreenContainerProps) {
  return (
    <section
      className={cx(styles.screen, toneClassNames[tone], className)}
      {...props}
    >
      {header ? <div className={styles.screenHeader}>{header}</div> : null}

      <div
        className={cx(
          styles.screenBody,
          gapClassNames[gap],
          padded && styles.screenBodyPadded,
          bodyClassName
        )}
      >
        {children}
      </div>

      {footer ? <div className={styles.screenFooter}>{footer}</div> : null}
    </section>
  );
}

export interface TopHeaderProps extends HTMLAttributesWithoutTitle<HTMLElement> {
  align?: HeaderAlign;
  eyebrow?: ReactNode;
  floating?: boolean;
  leading?: ReactNode;
  subtitle?: ReactNode;
  title: ReactNode;
  trailing?: ReactNode;
}

export function TopHeader({
  align = 'start',
  className,
  eyebrow,
  floating = false,
  leading,
  subtitle,
  title,
  trailing,
  ...props
}: TopHeaderProps) {
  const centerAligned = align === 'center';

  return (
    <header
      className={cx(
        styles.header,
        centerAligned && styles.headerCenter,
        floating && styles.headerFloating,
        className
      )}
      {...props}
    >
      {leading ? <div className={styles.headerLeading}>{leading}</div> : null}

      <div
        className={cx(styles.headerBody, centerAligned && styles.headerBodyCenter)}
      >
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>

      {trailing ? <div className={styles.headerTrailing}>{trailing}</div> : null}
    </header>
  );
}

export interface IconButtonShellProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export function IconButtonShell({
  children,
  className,
  label,
  type = 'button',
  ...props
}: IconButtonShellProps) {
  return (
    <button
      aria-label={label}
      className={cx(styles.iconButton, className)}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export interface ActionPillProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  strong?: boolean;
  tone?: Tone;
  vertical?: boolean;
}

export function ActionPill({
  children,
  className,
  icon,
  strong = false,
  tone = 'neutral',
  type = 'button',
  vertical = false,
  ...props
}: ActionPillProps) {
  return (
    <button
      className={cx(
        styles.actionPill,
        actionToneClassNames[tone],
        strong && styles.actionPillStrong,
        vertical && styles.actionPillVertical,
        className
      )}
      type={type}
      {...props}
    >
      {icon ? <span className={styles.actionIcon}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

export interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  align?: BubbleAlign;
  pointer?: BubblePointer;
  size?: BubbleSize;
  tone?: Tone;
}

export function SpeechBubble({
  align = 'center',
  children,
  className,
  pointer = 'bottom',
  size = 'md',
  tone = 'neutral',
  ...props
}: SpeechBubbleProps) {
  return (
    <div className={cx(styles.bubbleWrap, bubbleAlignClassNames[align])}>
      <div
        className={cx(
          styles.bubble,
          bubbleToneClassNames[tone],
          bubbleSizeClassNames[size],
          pointer !== 'none' && bubblePointerClassNames[pointer],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

export interface ObjectHeroWrapperProps extends HTMLAttributes<HTMLElement> {
  backdrop?: ReactNode;
  decorations?: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  hero: ReactNode;
  tone?: Tone;
}

export function ObjectHeroWrapper({
  backdrop,
  children,
  className,
  decorations,
  footer,
  header,
  hero,
  tone = 'neutral',
  ...props
}: ObjectHeroWrapperProps) {
  return (
    <section className={cx(styles.heroCard, className)} {...props}>
      {header ? <div className={styles.heroHeader}>{header}</div> : null}

      <div className={cx(styles.heroStage, heroToneClassNames[tone])}>
        <div className={styles.heroBackdrop}>{backdrop}</div>
        {decorations ? <div className={styles.heroDecorations}>{decorations}</div> : null}
        <div className={styles.heroMedia}>{hero}</div>
      </div>

      {children ? <div className={styles.heroContent}>{children}</div> : null}
      {footer ? <div className={styles.heroFooter}>{footer}</div> : null}
    </section>
  );
}

export interface DateCarouselShellProps extends HTMLAttributes<HTMLDivElement> {
  meta?: ReactNode;
  nextControl?: ReactNode;
  previousControl?: ReactNode;
}

export function DateCarouselShell({
  children,
  className,
  meta,
  nextControl,
  previousControl,
  ...props
}: DateCarouselShellProps) {
  return (
    <div className={cx(styles.dateShell, className)} {...props}>
      {meta ? <div className={styles.dateMeta}>{meta}</div> : null}
      <div className={styles.dateControl}>{previousControl}</div>
      <div className={styles.dateTrack}>{children}</div>
      <div className={styles.dateControl}>{nextControl}</div>
    </div>
  );
}

export interface PrimaryActionDockShellProps
  extends HTMLAttributes<HTMLElement> {
  layout?: DockLayout;
  supporting?: ReactNode;
}

export function PrimaryActionDockShell({
  children,
  className,
  layout = 'split',
  supporting,
  ...props
}: PrimaryActionDockShellProps) {
  return (
    <footer className={cx(styles.dock, className)} {...props}>
      {supporting ? <div className={styles.dockSupport}>{supporting}</div> : null}
      <div className={cx(styles.dockActions, dockLayoutClassNames[layout])}>
        {children}
      </div>
    </footer>
  );
}

interface HeadlineProps {
  subtitle?: ReactNode;
  title?: ReactNode;
}

function ShellHeadline({ subtitle, title }: HeadlineProps) {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <div className={styles.headline}>
      {title ? <h2 className={styles.headlineTitle}>{title}</h2> : null}
      {subtitle ? <p className={styles.headlineSubtitle}>{subtitle}</p> : null}
    </div>
  );
}

export interface SheetShellProps extends HTMLAttributesWithoutTitle<HTMLDivElement> {
  dismissAction?: ReactNode;
  footer?: ReactNode;
  handle?: boolean;
  open?: boolean;
  scrim?: boolean;
  subtitle?: ReactNode;
  title?: ReactNode;
}

export function SheetShell({
  children,
  className,
  dismissAction,
  footer,
  handle = true,
  open = true,
  scrim = true,
  subtitle,
  title,
  ...props
}: SheetShellProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.sheetOverlay}>
      {scrim ? <div className={styles.sheetScrim} aria-hidden="true" /> : null}

      <div className={cx(styles.sheetPanel, className)} {...props}>
        {handle ? <div className={styles.handle} aria-hidden="true" /> : null}

        <div className={styles.sheetHeader}>
          {(title || subtitle) ? (
            <div className={styles.drawerChrome}>
              <div className={styles.headerBody}>
                <ShellHeadline title={title} subtitle={subtitle} />
              </div>
              {dismissAction ? <div className={styles.headerTrailing}>{dismissAction}</div> : null}
            </div>
          ) : dismissAction ? (
            <div className={styles.drawerChrome}>
              <div className={styles.headerBody} />
              <div className={styles.headerTrailing}>{dismissAction}</div>
            </div>
          ) : null}
        </div>

        <div className={styles.sheetBody}>{children}</div>

        {footer ? <div className={styles.sheetFooter}>{footer}</div> : null}
      </div>
    </div>
  );
}

export interface DrawerShellProps extends HTMLAttributesWithoutTitle<HTMLElement> {
  footer?: ReactNode;
  handle?: boolean;
  leading?: ReactNode;
  subtitle?: ReactNode;
  title?: ReactNode;
  trailing?: ReactNode;
}

export function DrawerShell({
  children,
  className,
  footer,
  handle = true,
  leading,
  subtitle,
  title,
  trailing,
  ...props
}: DrawerShellProps) {
  return (
    <section className={cx(styles.drawer, className)} {...props}>
      {handle ? <div className={styles.handle} aria-hidden="true" /> : null}

      {(leading || title || subtitle || trailing) ? (
        <div className={styles.drawerHeader}>
          <div className={styles.drawerChrome}>
            {leading ? <div className={styles.headerLeading}>{leading}</div> : null}
            <div className={styles.headerBody}>
              <ShellHeadline title={title} subtitle={subtitle} />
            </div>
            {trailing ? <div className={styles.headerTrailing}>{trailing}</div> : null}
          </div>
        </div>
      ) : null}

      <div className={styles.drawerBody}>{children}</div>
      {footer ? <div className={styles.drawerFooter}>{footer}</div> : null}
    </section>
  );
}
