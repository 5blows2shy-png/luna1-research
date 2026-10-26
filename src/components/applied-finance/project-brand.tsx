import Image from "next/image";
import styles from "./project.module.css";

/** Primary approved lockup on a neutral field preserves the spectral logo colors. */
export function ProjectBrand() {
  return <span className={styles.brandLockup}><Image src="/brand/luna1-logo-horizontal.svg" alt="Luna1 Research" width={180} height={62} unoptimized /></span>;
}
