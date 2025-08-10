"use client";

import Link from "next/link";
import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/react";
import styles from "./index.module.css";
import React from "react";

export default function HomeContent() {
  // tRPC v11 调用 query
  const { data: hello, isLoading } = api.post.hello.useQuery({
    text: "from tRPC",
  });

  // v11 预取数据用 React Query 的 prefetch
  const utils = api.useUtils();
  // 组件加载时预取
  React.useEffect(() => {
    utils.post.getLatest.prefetch(undefined);
  }, [utils]);

  return (
    <>
      <div className={styles.cardRow}>
        <Link
          className={styles.card}
          href="https://create.t3.gg/en/usage/first-steps"
          target="_blank"
        >
          <h3 className={styles.cardTitle}>First Steps →</h3>
          <div className={styles.cardText}>
            Just the basics - Everything you need to know to set up your
            database and authentication.
          </div>
        </Link>
        <Link
          className={styles.card}
          href="https://create.t3.gg/en/introduction"
          target="_blank"
        >
          <h3 className={styles.cardTitle}>Documentation →</h3>
          <div className={styles.cardText}>
            Learn more about Create T3 App, the libraries it uses, and how to
            deploy it.
          </div>
        </Link>
      </div>

      <div className={styles.showcaseContainer}>
        <p className={styles.showcaseText}>
          {isLoading ? "Loading tRPC query..." : hello?.greeting}
        </p>
      </div>

      <LatestPost />
    </>
  );
}
