import React from "react";
import Badge from "react-bootstrap/esm/Badge";

export default function BadgeColorSelector({text}) {

    function getColor(){
        switch (text) {
            case "Completed":
                return "success";
            case "Needs Update":
                return "danger";
            case "Pending Submission":
                return "warning";
                case "Resubmitted":
                    return "primary";
            default:
                return "info";
        }
    }

  return (
    <Badge pill bg={getColor()} style={{ fontSize: "1em" }}>
      {text}
    </Badge>
  );
}
