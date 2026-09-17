"use client";
import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import TableLoadingIcon from "@/app/components/ux/TableLoadingIcon";
import { Column } from "primereact/column";
import { getBodyStyle, getHeaderStyle } from "@/app/components/Users/UserData";
import { useRouter } from "next/navigation";
import { getData, postData, updateListData } from "@/app/API/method";
import { extractResultsList, getApiErrorMessage } from "@/lib/apiResponse";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDeleteDialog from "@/app/components/ConfirmDeleteDialog";
import PageHeader from "@/app/components/ux/PageHeader";
import Button from "@/app/components/ux/Button";
import ActionMenu from "@/app/components/ux/ActionMenu";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const BANNER_LIST_ENDPOINT = "/admin-panel/banner";
const BANNER_DELETE_ENDPOINT = "/admin-panel/business/banner/delete";

export default function BannerManagement() {
  const { t } = useLanguage();
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
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
    }

    .banner-paginator .p-paginator-pages {
      display: inline-flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      align-items: center !important;
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
      min-width: 2.5rem !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
      margin: 0 0.15rem;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      background: #e5e7eb;
      color: #4b5563;
      transition: all 0.2s;
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
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
      const uid = item.user_id ?? item.business_id;
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

      const response = await getData(BANNER_LIST_ENDPOINT);
      const results = extractResultsList(response);
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
      if (selectedBanner.business_banner_file) {
        formData.append("business_banner", selectedBanner.business_banner_file);
      }
      if (selectedBanner.url || selectedBanner.business_link) {
        formData.append(
          "url",
          selectedBanner.url || selectedBanner.business_link
        );
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
    <ActionMenu
      disabled={loading || deleteSubmitting}
      items={[
        {
          label: "Edit",
          onClick: () => editBanner(rowData),
        },
        {
          label: "Delete",
          danger: true,
          onClick: () => confirmDelete(rowData),
        },
      ]}
    />
  );

  const handleNewListing = () => {
    router.push("/pages/banners/addbanner");
  };

  return (
    <div className="page-shell">
      <ToastContainer position="top-right" autoClose={3000} />
      <style jsx global>{paginatorStyles}</style>
      <PageHeader
        showBack
        title={t("pages.banners.title")}
        description={t("pages.banners.description")}
        actions={
          <Button variant="primary" onClick={handleNewListing}>
            Add Banner
          </Button>
        }
      />

      {error && (
        <div className="relative mx-4 mt-4 rounded-xl border border-[var(--color-danger)]/25 bg-[#FEF2F2] px-4 py-3 text-[var(--color-danger)] sm:mx-5">
          <span>{error}</span>
          <button
            type="button"
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
            loadingIcon={<TableLoadingIcon />}
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
                <label className="field-label">Banner Image</label>
                <div className="mb-2 h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  <img 
                    src={selectedBanner.business_banner?.[0] || "/b6.png"} 
                    alt="Banner" 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="field-control"
                />
              </div>

              <div>
                <label className="field-label">Business Name</label>
                <input
                  type="text"
                  value={selectedBanner.business_name}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_name: e.target.value})}
                  className="field-control"
                />
              </div>

              <div>
                <label className="field-label">Business Email</label>
                <input
                  type="email"
                  value={selectedBanner.business_email}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_email: e.target.value})}
                  className="field-control"
                />
              </div>

              <div>
                <label className="field-label">Category</label>
                <input
                  type="text"
                  value={selectedBanner.business_category}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_category: e.target.value})}
                  className="field-control"
                />
              </div>

              <div>
                <label className="field-label">Subcategory</label>
                <input
                  type="text"
                  value={selectedBanner.business_subcategory}
                  onChange={(e) => setSelectedBanner({...selectedBanner, business_subcategory: e.target.value})}
                  className="field-control"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={saveBanner}
                  className="btn-primary"
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