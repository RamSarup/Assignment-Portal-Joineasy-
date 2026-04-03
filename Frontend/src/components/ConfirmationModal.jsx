function ConfirmationModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full mx-4">
        <div className="text-4xl mb-3">📋</div>
        <p className="text-lg font-semibold text-gray-800 mb-1">
          Confirm Acknowledgment
        </p>
        <p className="text-sm text-gray-500 mb-5">
          By clicking <strong>Yes</strong>, you confirm that you have completed
          and submitted this assignment via the provided link.
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
          >
            Yes, I have submitted
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-5 py-2.5 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
