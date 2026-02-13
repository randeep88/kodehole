"use client";

import {
  ChevronDown,
  ChevronRight,
  Files,
  Folder,
  FolderOpen,
  Loader2,
  SearchIcon,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Tree } from "react-arborist";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { useAuth } from "@/src/context/AuthContext";
import { useUser } from "@/src/hooks/useUser";

type NodeType = {
  name: string;
  type: "file" | "folder";
  children?: NodeType[];
};

const getFileIcon = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  const iconMap: { [key: string]: string } = {
    ts: "vscode-icons:file-type-typescript",
    tsx: "vscode-icons:file-type-typescript",
    js: "vscode-icons:file-type-js",
    jsx: "vscode-icons:file-type-reactjs",
    py: "vscode-icons:file-type-python",
    vue: "vscode-icons:file-type-vue",
    svelte: "vscode-icons:file-type-svelte",
    go: "vscode-icons:file-type-go",
    rs: "vscode-icons:file-type-rust",
    json: "vscode-icons:file-type-json",
    html: "vscode-icons:file-type-html",
    css: "vscode-icons:file-type-css",
    scss: "vscode-icons:file-type-scss",
    md: "vscode-icons:file-type-markdown",
  };

  const iconName = iconMap[ext] || "vscode-icons:default-file";
  return `https://api.iconify.design/${iconName}.svg`;
};

function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProjectUI({
  tree,
  orbit,
  snapshot,
}: {
  tree: NodeType[];
  orbit: string;
  snapshot: string;
}) {
  const { theme } = useTheme();
  const { user, isLoading } = useAuth();
  const { user: dbUser } = useUser(user?.username!);

  const [path, setPath] = useState<string>(".kodehole.json");

  const [html, setHtml] = useState<string>(
    "<div class='text-center h-full flex flex-col items-center justify-center'><h1 class='text-lg font-semibold text-foreground'>No file selected</h1><p class='text-muted-foreground'>Select a file to view its content</p></div>",
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [loadingFile, setLoadingFile] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  async function openFile(path: string) {
    setLoadingFile(true);
    if (!path) return;
    const res = await axios.get(
      `/api/orbits/${orbit}/file?path=${path}&snapshot=${snapshot}&theme=${theme}`,
    );
    const data = res.data;
    setHtml(data.html);
    setLoadingFile(false);
  }

  useEffect(() => {
    openFile(path!);
  }, [theme, path]);

  const data = useMemo(() => {
    const transform = (nodes: NodeType[], basePath = ""): any[] =>
      nodes.map((node) => {
        const fullPath = `${basePath}${node.name}`;
        return {
          id: fullPath,
          name: node.name,
          path: fullPath,
          children: node.children
            ? transform(node.children, `${fullPath}/`)
            : undefined,
        };
      });

    return transform(tree);
  }, [tree]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="border-r w-[300px] flex flex-col">
        <div className="p-3">
          <div className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Files size={20} /> Files
          </div>

          <div className="relative w-full">
            <InputGroup>
              <InputGroupInput
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <div className="flex-1">
          <Tree
            openByDefault={false}
            data={data}
            width={300}
            indent={20}
            rowHeight={28}
            searchTerm={debouncedSearchTerm}
            searchMatch={(node, term) =>
              node.data.name.toLowerCase().includes(term.toLowerCase())
            }
          >
            {(props) => (
              <Node {...props} onFileClick={openFile} setPath={setPath} />
            )}
          </Tree>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 w-[calc(100%-300px)]">
        <div className="p-3 border-b bg-background flex items-center gap-3 font-medium">
          <div>
            <Avatar className="w-7 h-7">
              <AvatarImage src={dbUser?.data?.image} />
              <AvatarFallback className="text-xs">
                {dbUser?.data?.name?.split(" ")[0][0]}
                {dbUser?.data?.name?.split(" ")[1][0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            {orbit} / {snapshot}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {loadingFile ? (
            <div className="flex items-center gap-2 justify-center h-full">
              <Loader2 className="animate-spin" size={20} />
              <p>Loading...</p>
            </div>
          ) : (
            <div
              className="bg-primary/5 text-sm focus:outline-none focus:border-none w-full h-full"
              style={{
                flex: 1,
                overflow: "auto",
                padding: 16,
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- NODE RENDERER ---------------- */
function Node({ node, style, onFileClick, setPath }: any) {
  const isFile = node.isLeaf;

  return (
    <div
      style={{
        ...style,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 5,
      }}
      className={`p-1 text-sm select-none ${node.isSelected ? "bg-primary/20" : "hover:bg-primary/10"}`}
      onClick={() => {
        if (isFile) {
          setPath(node.data.path);
          onFileClick(node.data.path);
        } else {
          node.toggle();
        }
      }}
    >
      <span className="transition-all">
        {isFile ? (
          <img
            src={getFileIcon(node.id)}
            alt={`${node.id} icon`}
            width={16}
            height={16}
            className="ms-5"
          />
        ) : node.isOpen ? (
          <div className="flex items-center gap-1">
            <ChevronDown size={17} />
            <FolderOpen size={17} />
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <ChevronRight size={17} />
            <Folder size={17} />
          </div>
        )}
      </span>
      <span>{node.data.name}</span>
    </div>
  );
}
