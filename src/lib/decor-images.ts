import { asset } from './paths';

// The 4096 px pack artwork in public/assets/digital has 640 and 1280 px WebP
// copies next to it. The PNGs stay for link previews and structured data.
const withVariants = /^assets\/digital\/pack-\d+-3\.png$/;

/** src and srcset for decorative pack artwork; other paths are returned as is. */
export function decorImage(path: string): { src: string; srcset?: string } {
  if (!withVariants.test(path)) return { src: asset(path) };
  const base = path.replace(/\.png$/, '');
  return {
    src: asset(`${base}-1280.webp`),
    srcset: `${asset(`${base}-640.webp`)} 640w, ${asset(`${base}-1280.webp`)} 1280w`,
  };
}
