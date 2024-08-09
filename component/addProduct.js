import { useEffect, useState } from "react";
//component imort
import CapacityChart from "./capacityChart";
import ColorChart from "./colorChart";

// style import
import styles from "./addProduct.module.scss";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productData, setProductData] = useState("");
  const [error, setError] = useState("");
  const [jsonDataError, setJsonDataError] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [products, setProducts] = useState([]);

  const capacityOptions = () => {
    let capacity = [];
    products?.map((item) => {
      if (item.data && item?.data?.capacity) {
        capacity.push(item?.data?.capacity);
      }
    });
    const uniqueCapacity = [...new Set(capacity)];
    return uniqueCapacity;
  };

  const colorOptions = () => {
    let colors = [];
    products?.map((item) => {
      if (item.data && item?.data?.color) {
        colors.push(item?.data?.color);
      }
    });
    const uniqueColors = [...new Set(colors)];
    return uniqueColors;
  };

  const handleAddProduct = async () => {
    const id = Math.random(); // Generate a unique ID
    const sendData = {
      id: id,
      name: productName,
      data: productData,
    };

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: sendData,
      });

      if (response.ok) {
        setProducts((prev) => [sendData, ...prev]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      window.alert("Product added successfully!");
      setProductName("");
      setProductData("");
    } catch (error) {
      console.error("Error adding product:", error);
      window.alert("Failed to add product. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setProductName(value);

    if (!value) {
      setError("Product name is required.");
    } else {
      setError("");
    }
  };
  const handleInputChangeProductData = (event) => {
    const value = event.target.value;
    setProductData(value);

    // Validate if the input is valid JSON
    try {
      JSON.parse(value);
      setJsonDataError("");
    } catch (e) {
      setJsonDataError("Invalid JSON format");
    }
  };

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8000/api/products");
    const allData = await res.json();
    const _sanitizedData = allData?.map((data) => {
      let filteredData = {};
      Object.keys(data)?.forEach((key) => {
        filteredData[key.toLowerCase()] = data[key];
        if (
          key === "data" &&
          data.hasOwnProperty("data") &&
          Boolean(data["data"])
        ) {
          Object.keys(data?.[key])?.forEach((dataKey) => {
            filteredData[key.toLowerCase()][dataKey?.toLowerCase()] =
              data[key][dataKey];
          });
        }
      });
      return filteredData;
    });
    setProducts(_sanitizedData);
  };

  const filteredProducts = () => {
    return products.filter((item) => {
      return (
        (!selectedColor || item.data?.color === selectedColor) &&
        (!selectedCapacity || item.data?.capacity === selectedCapacity)
      );
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className={styles.mainContainer}>
        <div
          className={styles.headerContainer}
          onBlur={() => {
            setError("");
            setJsonDataError("");
          }}
        >
          <h2 className={styles.heading}>
            Product Listing with{" "}
            <span
              style={{ color: "#a9acb0", borderBottom: "3px solid #a9acb0" }}
            >
              Charts
            </span>
          </h2>
          <div className={styles.inputContainer}>
            <div className={styles.addProductCn}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  className="rdg-text-editor"
                  value={productName}
                  placeholder="Product Name"
                  onChange={(e) => handleInputChange(e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputChange(e);
                    }
                  }}
                  style={{
                    border: "2px solid grey",
                    borderRadius: "2px",
                    outline: "none",
                    padding: "0.8rem",
                  }}
                />
                {error && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "10px",
                      fontSize: "12px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {error}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  className="rdg-text-editor"
                  value={productData}
                  placeholder="Product Data(Json)"
                  onChange={(e) => handleInputChangeProductData(e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleInputChangeProductData(e);
                    }
                  }}
                  style={{
                    border: "2px solid grey",
                    borderRadius: "2px",
                    outline: "none",
                    padding: "0.8rem",
                  }}
                />
                {jsonDataError && (
                  <span
                    style={{
                      color: "red",
                      marginTop: "10px",
                      fontSize: "12px",
                      fontFamily: "sans-serif",
                    }}
                  >
                    {jsonDataError}
                  </span>
                )}
              </div>
              <button
                type="button"
                // style={{
                //   padding: "0.8rem",
                //   fontWeight: "600",
                //   color: "#696c70",
                //   height: "2.8rem",
                //   cursor: "pointer",
                // }}
                className={styles.addBtn}
                onClick={() => handleAddProduct()}
              >
                Add Product
              </button>
            </div>
            <div className={styles.filterContainer}>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                style={{
                  padding: "0.8rem",
                  borderRadius: "4px",
                  border: "1px solid grey",
                  outline: "none",
                }}
              >
                <option value="" disabled>
                  Filter by Color
                </option>
                <option value="">All</option>
                {colorOptions()?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={selectedCapacity}
                onChange={(e) => setSelectedCapacity(e.target.value)}
                style={{
                  padding: "0.8rem",
                  borderRadius: "4px",
                  outline: "none",
                  border: "1px solid grey",
                }}
              >
                <option value="" disabled>
                  Filter by Capacity
                </option>
                <option value="">All</option>
                {capacityOptions()?.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredProducts()?.map((item) => {
          return (
            <div className={styles.productContainer}>
              <h3 style={{ color: "black" }}>{item?.name}</h3>
              {item?.data ? (
                <>
                  <p>Color : {item?.data?.color}</p>
                  <p>Capacity : {item?.data?.capacity}</p>
                </>
              ) : (
                <p>Data : {"N/A"}</p>
              )}
            </div>
          );
        })}

        <div className={styles.chartContainer}>
          <ColorChart products={filteredProducts()} />
          <CapacityChart products={filteredProducts()} />
        </div>
      </div>
    </>
  );
}
