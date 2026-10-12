"use client";

import React, { useEffect, useState } from "react";
import { Settings, X, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProviderInfo } from "@/lib/providers/types";

export function SettingsDrawer() {
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/providers/status");
      const data = await res.json();
      if (data?.providers) {
        setProviders(data.providers);
      }
    } catch (e) {
      console.error("Failed to load providers status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStatus();
    }
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Provider Settings"
        className="text-gray-600 hover:text-black hover:bg-gray-100"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-50 flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Data Providers Status</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Transparency on live API connections vs sample fallback data for all services.
            </p>

            <div className="mt-6 space-y-4 flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-400 gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Checking provider statuses...</span>
                </div>
              ) : (
                providers.map((p) => {
                  const isConnected = p.status === "connected";
                  return (
                    <div
                      key={p.key}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-800 text-base">{p.name}</span>
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Using sample data
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-600 bg-white border border-gray-100 rounded-md p-2 mt-1">
                        <span className="font-medium text-gray-500">Enabled by: </span>
                        <code className="text-gray-800 font-mono text-[11px] bg-gray-100 px-1 py-0.5 rounded">
                          {p.envKey}
                        </code>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={fetchStatus}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Re-check Providers
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
