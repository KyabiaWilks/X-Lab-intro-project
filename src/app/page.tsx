import styles from "./index.module.css";
import HomeContent from "./HomeContent";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Create <span className={styles.pinkSpan}>T3</span> App
        </h1>

        <HomeContent />
      </div>
    </main>
  );
}
