"use client";
import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getBodyStyle, getHeaderStyle } from "@/app/components/Users/UserData";
import BackButton from "@/app/components/BackButton";
import { useRouter } from "next/navigation";
import { getBanData, postData, updateListData } from "@/app/API/method";
import { getApiErrorMessage } from "@/lib/apiResponse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";

const BANNER_LIST_ENDPOINT = "/auth/business/banner";
const BANNER_DELETE_ENDPOINT = "/admin-panel/business/banner/delete";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  // Custom Paginator Styling
  const paginatorStyles = `
    .banner-paginator .p-paginator {
      background: transparent;
      border-radius: 20px;
      padding: 10px 10px;
      justify-content: flex-end;
    }
    
    .banner-paginator .p-paginator-current {
      color: #6b7280;
      font-size: 0.875rem;
      margin-right: 1rem;
    }
    
    .banner-paginator .p-paginator-page,
    .banner-paginator .p-paginator-first,
    .banner-paginator .p-paginator-prev,
    .banner-paginator .p-paginator-next,
    .banner-paginator .p-paginator-last {
      min-width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.15rem;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      background: #e5e7eb;
      color: #4b5563;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .banner-paginator .p-paginator-page:hover,
    .banner-paginator .p-paginator-first:hover,
    .banner-paginator .p-paginator-prev:hover,
    .banner-paginator .p-paginator-next:hover,
    .banner-paginator .p-paginator-last:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }
    
    .banner-paginator .p-paginator-page.p-highlight {
      background: #d8b039;
      color: white;
      border-color: #d8b039;
      font-weight: 600;
    }
    
    .banner-paginator .p-dropdown {
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      height: 2.5rem;
      margin-left: 0.5rem;
    }
    
    .banner-paginator .p-dropdown .p-dropdown-label {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  `;

  const onPage = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const transformBannerData = (results) =>
    results.map((item) => {
      const mongoId = item.id ?? item._id ?? "";
      const uid = item.user_id;
      const userIdDisplay = Array.isArray(uid)
        ? uid.join(", ")
        : uid ?? "";
      return {
        _id: mongoId,
        user_id: userIdDisplay,
        business_email: item.business_email ?? "",
        business_name: item.business_name ?? "",
        business_category: item.business_category ?? "",
        business_subcategory: item.business_subcategory ?? "",
        business_banner: Array.isArray(item.business_banner)
          ? item.business_banner
          : item.business_banner
            ? [item.business_banner]
            : [],
      };
    });

  // Using useCallback to memoize the fetch function
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      /** No Bearer header — same as pre-change behavior; /auth/business/banner returns full list for unauthenticated GET. */
      const response = await getBanData(BANNER_LIST_ENDPOINT);
      if (response.error || response.status !== 200) {
        throw new Error(response?.error || "Failed to fetch banners");
      }

      const results = Array.isArray(response.data) ? response.data : [];
      const transformedData = transformBannerData(results);
      setBanners(transformedData);

      if (transformedData.length === 0) {
        toast.info("No banners found");
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, err.message || "Failed to load banners");
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fixed useEffect with proper dependencies
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]); // Only re-run if fetchBanners changes

  const editBanner = (banner) => {
    setSelectedBanner({
      ...banner,
      business_banner_file: null
    });
    setEditModalVisible(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedBanner(prev => ({
        ...prev,
        business_banner: [URL.createObjectURL(file)],
        business_banner_file: file
      }));
    }
  };

  const saveBanner = async () => {
    if (!selectedBanner) return;

    try {
      setLoading(true);
      const formData = new FormData();
      
      formData.append("banner_id", selectedBanner._id);
      formData.append("business_email", selectedBanner.business_email);
      formData.append("business_name", selectedBanner.business_name);
      formData.append("business_category", selectedBanner.business_category);
      formData.append("business_subcategory", selectedBanner.business_subcategory);
      
      if (selectedBanner.business_banner_file) {
        formData.append("business_banner", selectedBanner.business_banner_file);
      }

      await updateListData(
        "/admin-panel/business/banner/update",
        formData
      );

      await fetchBanners();
      setEditModalVisible(false);
      toast.success("Banner updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (banner) => {
    setSelectedBanner(banner);
    setDeleteModalVisible(true);
  };

  const deleteBanner = async () => {
    if (!selectedBanner) return;
    const bannerId = selectedBanner._id;
    if (!bannerId) {
      toast.error("Missing banner id");
      return;
    }

    try {
      setDeleteSubmitting(true);
      await postData(BANNER_DELETE_ENDPOINT, {
        banner_id: String(bannerId),
      });
      setDeleteModalVisible(false);
      setSelectedBanner(null);
      await fetchBanners();
      toast.success("Banner deleted successfully");
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to delete banner");
      setError(msg);
      toast.error(msg);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const ImageTemplate = ({ rowData }) => {
    const [currentSrc, setCurrentSrc] = useState(
      rowData.business_banner?.[0] || "/b6.png"
    );
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      setCurrentSrc(rowData.business_banner?.[0] || "/b6.png");
      setHasError(false);
    }, [rowData.business_banner]);

    const handleError = () => {
      if (!hasError) {
        setCurrentSrc("/b6.png");
        setHasError(true);
      }
    };

    return (
      <div className="w-16 h-16 flex items-center justify-center">
        <img
          src={currentSrc}
          alt={rowData.business_name || "Banner"}
          className="max-w-full max-h-full rounded-md object-cover"
          onError={handleError}
        />
      </div>
    );
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => editBanner(rowData)}
        className="border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        disabled={loading}
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => confirmDelete(rowData)}
        className="border border-black px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        disabled={loading || deleteSubmitting}
      >
        Delete
      </button>
    </div>
  );

  const handleNewListing = () => {
    router.push("/pages/banners/addbanner");
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <style jsx global>{paginatorStyles}</style>
      <div className="flex justify-between p-5 border-b">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-[#78828A] text-[24px] font-[500]">All Banners</h1>
        </div>
        <button
          onClick={handleNewListing}
          className="px-4 py-2 bg-[#CD9403] text-white rounded-lg hover:bg-[#b78302] transition"
        >
          Add Banner
        </button>
      </div>

      {error && (
        <div className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

      <DataTable
        value={banners}
        paginator
        first={first}
        rows={rows}
        onPage={onPage}
       // rowsPerPageOptions={[5, 10, 20]}
       // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} banners"
       // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        tableStyle={{ minWidth: "100%" }}
        loading={loading}
        emptyMessage="No banners found. Please add a new banner."
        paginatorClassName="banner-paginator m-5"
      >
        <Column
          field="user_id"
          header="User ID"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          body={(rowData) => <ImageTemplate rowData={rowData} />}
          header="Banner Image"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          field="business_email"
          header="Business Email"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          field="business_name"
          header="Business Name"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          field="business_category"
          header="Category"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          field="business_subcategory"
          header="Subcategory"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
        <Column
          body={actionTemplate}
          header="Actions"
          headerStyle={getHeaderStyle()}
          bodyStyle={getBodyStyle()}
        />
      </DataTable>

      {/* Edit Modal */}
      {isEditModalVisible && selectedBanner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto py-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white pb-2">Edit Banner</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Banner Image</label>
                <div className="mb-2 h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedBanner.business_banner?.[0] || "https://via.placeholder.com/300"} 
                    alt="Banner" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full text-sm border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input
                  type="text"
                  value={selectedBanner.business_name}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Business Email</label>
                <input
                  type="email"
                  value={selectedBanner.business_email}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_email: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={selectedBanner.business_category}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_category: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subcategory</label>
                <input
                  type="text"
                  value={selectedBanner.business_subcategory}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_subcategory: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBanner}
                  className="px-4 py-2 bg-[#CD9403] text-white rounded"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        visible={isDeleteModalVisible}
        onHide={() => {
          if (deleteSubmitting) return;
          setDeleteModalVisible(false);
          setSelectedBanner(null);
        }}
        onConfirm={deleteBanner}
        title="Are you sure you want to delete this banner?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmLoading={deleteSubmitting}
      />
    </div>
  );
}