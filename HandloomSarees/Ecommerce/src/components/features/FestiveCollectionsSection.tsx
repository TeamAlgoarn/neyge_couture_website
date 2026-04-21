import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicFestiveCollections } from "@/api/festiveCollections";

type FestiveCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  banner_image?: string;
  popup_enabled?: boolean;
  popup_message?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  products?: any[];
};

export default function FestiveCollectionsSection() {
  const [items, setItems] = useState<FestiveCollection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestives = async () => {
      try {
        setLoading(true);
        const data = await getPublicFestiveCollections();
        console.log("Festive collections response:", data);
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load festive collections:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFestives();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: "90px 0", background: "#FFF9F0" }}>
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "0 64px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 12,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "#7a5c44",
            }}
          >
            Loading festive collections...
          </p>
        </div>
      </section>
    );
  }

  if (!items.length) {
    console.log("No festive collections to render");
    return null;
  }

  return (
    <section
      style={{
        padding: "110px 0",
        background: "#FFF9F0",
      }}
    >
      <div
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "0 64px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 10,
              letterSpacing: ".30em",
              textTransform: "uppercase",
              color: "#C4980A",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            Seasonal Edit
          </p>

          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(30px, 4vw, 52px)",
              fontWeight: 400,
              color: "#800020",
              lineHeight: 1.1,
              letterSpacing: ".05em",
              marginBottom: 14,
            }}
          >
            Festive Collections
          </h2>

          <div
            style={{
              width: 40,
              height: 1,
              background: "#C4980A",
              margin: "0 auto 16px",
            }}
          />

          <p
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontSize: 15,
              color: "#4a3828",
              fontWeight: 300,
              lineHeight: 1.8,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Discover handpicked festive sarees curated for special moments and celebrations.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/festive/${item.slug}`}
              style={{
                textDecoration: "none",
                background: "#fff",
                border: "1px solid rgba(196,152,10,.18)",
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,.05)",
                color: "inherit",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 320,
                  background: "#F5E6D3",
                  overflow: "hidden",
                }}
              >
                {item.banner_image ? (
                  <img
                    src={item.banner_image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "'Josefin Sans', sans-serif",
                      color: "#7a5c44",
                    }}
                  >
                    No Banner
                  </div>
                )}
              </div>

              <div style={{ padding: 22 }}>
                <h3
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 24,
                    fontWeight: 500,
                    color: "#800020",
                    marginBottom: 10,
                    lineHeight: 1.2,
                  }}
                >
                  {item.name}
                </h3>

                <p
                  style={{
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: 14,
                    color: "#4a3828",
                    fontWeight: 300,
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  {item.description || item.popup_message || "Explore this festive edit."}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: 11,
                    letterSpacing: ".12em",
                    textTransform: "uppercase",
                    color: "#C4980A",
                    fontWeight: 600,
                  }}
                >
                  <span>{item.is_active ? "Active" : "Inactive"}</span>
                  <span>{item.products?.length || 0} Products</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}