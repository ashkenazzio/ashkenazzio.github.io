/**
 * Build responsive <img> attributes from a base filename in /public.
 *
 * Assumes the build pipeline emits `<name>-400w.webp` and `<name>-800w.webp`
 * alongside the full-size `<name>.webp`. When `hasVariants` is false (e.g. a
 * new screenshot that hasn't been run through the variant pipeline yet) it
 * degrades to a plain `src` with no srcSet so the browser doesn't 404 the
 * derived URLs.
 *
 * @param imageName base filename, e.g. "TrapCheck.webp"
 * @param options.sizes  the `sizes` attribute (defaults to the card layout)
 * @param options.hasVariants  whether -400w/-800w variants exist (default true)
 */
export const getImageSrcSet = (
  imageName: string,
  options: { sizes?: string; hasVariants?: boolean } = {}
) => {
  const {
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
    hasVariants = true,
  } = options;

  if (!hasVariants) {
    return { src: `/${imageName}` };
  }

  const baseName = imageName.replace('.webp', '');
  return {
    src: `/${baseName}-800w.webp`,
    srcSet: `/${baseName}-400w.webp 400w, /${baseName}-800w.webp 800w, /${imageName} 1200w`,
    sizes,
  };
};

/** `sizes` value tuned for full-width modal gallery slides. */
export const MODAL_IMAGE_SIZES = '(max-width: 640px) 100vw, 768px';
