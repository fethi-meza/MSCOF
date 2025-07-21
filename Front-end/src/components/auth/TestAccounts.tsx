
import React from "react";
import { Button } from "@/components/ui/button";
import { seedTestAccounts } from "@/lib/testAccountUtils";

export function TestAccounts() {
  return (
    <div className="mt-6 p-4 bg-muted rounded-lg space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Test Accounts:</h3>
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-1">
            <span className="font-semibold">Student:</span>
            <span>student@test.com</span>
            <span className="font-semibold">Password:</span>
            <span>password123</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <span className="font-semibold">Admin:</span>
            <span>admin@test.com</span>
            <span className="font-semibold">Password:</span>
            <span>password123</span>
          </div>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => seedTestAccounts()}
        className="w-full"
      >
        Refresh Test Accounts
      </Button>
    </div>
  );
}
