import styles from '../styles/Button.module.scss';

interface ButtonProps {
  label: string;
}

export default function Button({ label }: ButtonProps) {
  return <button className={styles.button}>{label}</button>;
}