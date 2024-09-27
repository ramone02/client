import { Button } from "primereact/button";
import "./footerContent.css";

interface FooterContentProps {
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCancel: () => void;
}

export const FooterContent = ({
  handleSubmit,
  handleCancel,
}: FooterContentProps) => {
  return (
    <div className="footer-content">
      <Button
        type="submit"
        label="Confirmar"
        icon="pi pi-check"
        onClick={handleSubmit}
        autoFocus
      />
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={handleCancel}
        className="p-button-text"
      />
    </div>
  );
};
