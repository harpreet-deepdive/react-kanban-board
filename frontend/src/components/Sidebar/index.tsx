"use client";
import React, { FC, useState, useContext, useEffect } from "react";
import { Sidenav, Nav } from "rsuite";

import DashboardIcon from "@rsuite/icons/legacy/Dashboard";
import { SidebarContext } from "@/shared/context/sidebarContext";

interface SideNavProps {
  appearance: "default" | "inverse" | "subtle" | undefined;
  openKeys: string[];
  expanded: boolean | undefined;
  onOpenChange: (keys: string[]) => void;
  onExpand: (expanded: boolean) => void;
  activeKey: string;
  onSelect: (activeKey: string) => void;
}

const styles = {
  width: 240,
  height: "100vh",
  display: "inline-table",
  backgroundColor: "#fff",
};
const collapseStyles = {
  width: 10,
  height: "100vh",
  display: "inline-table",
};

const CustomSidenav: FC<SideNavProps> = ({
  appearance,
  openKeys,
  expanded,
  onOpenChange,
  onExpand,
  ...navProps
}) => {
  const sidebarCtx = useContext(SidebarContext);
  return (
    <div className="fixed" style={expanded ? styles : collapseStyles}>
      <Sidenav
        className="h-screen shadow-md bg-white"
        appearance={appearance}
        expanded={expanded}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
      >
        <Sidenav.Body>
          <Nav {...navProps}>
            {sidebarCtx.expanded && (
              <Nav.Item href="#" className="flex items-center mb-4 text-2xl ">
                <img
                  className="w-8 h-8 mr-2"
                  src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                  alt="logo"
                />
                <span className="text-black font-extrabold"> Hammer </span>
              </Nav.Item>
            )}
            <Nav.Menu eventKey="4" title="Boards" icon={<DashboardIcon />}>
              <Nav.Item eventKey="4-1">Applications</Nav.Item>
              <Nav.Item eventKey="4-2">Channels</Nav.Item>
              <Nav.Item eventKey="4-3">Versions</Nav.Item>
              <Nav.Menu eventKey="4-5" title="Custom Action">
                <Nav.Item eventKey="4-5-1">Action Name</Nav.Item>
                <Nav.Item eventKey="4-5-2">Action Params</Nav.Item>
              </Nav.Menu>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle onToggle={onExpand} />
      </Sidenav>
    </div>
  );
};

const Sidebar = () => {
  const sidebarCtx = useContext(SidebarContext);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [openKeys, setOpenKeys] = useState<string[]>(["3", "4"]);
  const [expanded, setExpand] = useState<boolean>(sidebarCtx.expanded);

  useEffect(() => {
    sidebarCtx.setExpanded(expanded);
  }, [expanded]);

  return (
    <CustomSidenav
      activeKey={activeKey}
      openKeys={openKeys}
      onOpenChange={setOpenKeys}
      onSelect={setActiveKey}
      expanded={expanded}
      onExpand={setExpand}
      appearance="subtle"
    />
  );
};

export default Sidebar;
