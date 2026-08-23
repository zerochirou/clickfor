import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, HardDriveUpload } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import FileUpload from "@/components/commons/upload-file/drag-and-drop";

export default function AddProductPage() {
  return (
    <div className="px-4 py-8 mx-auto max-w-6xl w-full">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant={"outline"} size={"icon-lg"}>
            <ChevronLeft />
          </Button>
          <h1 className="text-2xl font-semibold">Tambah Produk</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"secondary"}>Buang</Button>
          <Button variant={"outline"}>Simpan Draft</Button>
          <Button variant={"default"}>
            Publish
            <HardDriveUpload />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-5 gap-4 mt-4">
        <div className="col-span-3 flex flex-col gap-4">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
              <CardDescription>Bagian ini akan menampilkan informasi umum produk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="productName">Nama produk</FieldLabel>
                    <Input
                      id="productName"
                      autoComplete="on"
                      placeholder="Nasi Goreng Versi 1"
                    />
                    <FieldDescription>
                      Gunakan nama produk yang unik dan mudah diingat.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                    <Textarea id="description" autoComplete="off" />
                    <FieldDescription>
                      Dekripsi yang singkat dan jelas dapat membantu menjelaskan
                      produk Anda.
                    </FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <Switch id="isActive" />
                    <FieldLabel htmlFor="isActive">
                      Apakah produk ini tersedia untuk dirilis?
                    </FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Switch id="isUp" />
                    <FieldLabel htmlFor="isUp">
                      Optimalkan Produk ini?
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Gambar Produk</CardTitle>
              <CardDescription>Bagian ini akan menampilkan gambar produk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FileUpload />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Harga</CardTitle>
              <CardDescription>Bagian ini akan menampilkan harga produk</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="purchasePrice">COGS (Modal per produk)</FieldLabel>
                    <Input
                      id="purchasePrice"
                      autoComplete="on"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <FieldDescription>
                      Biaya pembuatan atau modal per produk.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="salePrice">Harga Jual</FieldLabel>
                    <Input
                      id="salePrice"
                      autoComplete="off"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <FieldDescription>
                      Harga jual per produk. Pastikan harga ini lebih tinggi dari harga modal.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="minStock">Minimal Stok</FieldLabel>
                    <Input
                      id="minStock"
                      autoComplete="off"
                      type="number"
                      step="0.01"
                      min="0"
                    />
                    <FieldDescription>
                      Minimal stok yang harus tersedia untuk produk ini.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
