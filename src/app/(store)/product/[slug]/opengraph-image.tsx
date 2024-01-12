import { api } from "@/data/api";
import { Product } from "@/data/types/product";
import { env } from "@/env";
import colors from "tailwindcss/colors";
import { ImageResponse } from "next/og";
import Image from "next/image";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

async function getProduct(slug: string): Promise<Product> {
  const response = await api(`/products/${slug}`, {
    next: {
      revalidate: 60 * 60, // 1h
    },
  });

  const product = await response.json();

  return product;
}

// Image generation
export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  // Font
  const interSemiBold = fetch(
    new URL("./Inter-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const product = await getProduct(params.slug);

  const productTitle = product.title;
  const productImageURL = new URL(product.image, env.APP_URL).toString();

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: `linear-gradient(180deg, ${colors.zinc[950]} 0%, ${colors.zinc[900]} 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <span
          style={{
            textAlign: "center",
            fontSize: 40,
            color: "white",
            position: "absolute",
            top: 40,
            width: "auto",
            margin: "0 auto",
          }}>
          {productTitle}
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: -390,
            width: "82%",
          }}>
          <img src={productImageURL} alt="" style={{}} />
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
