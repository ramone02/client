import { Button } from "primereact/button";
import "./headerUser.css";

interface HeaderUserProps {
  header: string;
  handleVisible: (arg0: boolean) => void;
  labelButton: string;
}

export const HeaderUser = ({
  header,
  handleVisible,
  labelButton,
}: HeaderUserProps) => {
  return (
    <div className="header-user">
      <h2>{header}</h2>
      <Button
        label={labelButton}
        icon={"pi pi-plus"}
        iconPos="left"
        size="small"
        onClick={() => handleVisible(true)}
      />
    </div>
  );
};
