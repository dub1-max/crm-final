import { useState } from "react";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateTaskForm from "./create-task-form";

const CreateTaskDialog = (props: { projectId?: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-auto my-5 border-0">
        <DialogTitle className="sr-only">Create New Task</DialogTitle>
        <DialogDescription className="sr-only">
          Create a new task for your project
        </DialogDescription>
        <CreateTaskForm projectId={props.projectId} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
